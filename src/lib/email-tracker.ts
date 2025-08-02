import { prisma } from './prisma'

export interface EmailTrackingData {
  recipientEmail: string
  emailType: 'welcome' | 'milestone' | 'admin'
  success: boolean
  errorMessage?: string
  waitlistId?: string
}

class EmailTracker {
  async logEmail(data: EmailTrackingData) {
    try {
      const emailLog = await prisma.emailLog.create({
        data: {
          recipientEmail: data.recipientEmail,
          emailType: data.emailType,
          success: data.success,
          errorMessage: data.errorMessage,
          waitlistId: data.waitlistId,
        }
      })

      // Update waitlist entry if applicable
      if (data.waitlistId && data.success) {
        await prisma.waitlist.update({
          where: { id: data.waitlistId },
          data: {
            emailSent: true,
            lastEmailSent: new Date(),
            emailFailures: data.success ? undefined : { increment: 1 }
          }
        })
      } else if (data.waitlistId && !data.success) {
        await prisma.waitlist.update({
          where: { id: data.waitlistId },
          data: {
            emailFailures: { increment: 1 }
          }
        })
      }

      return emailLog
    } catch (error) {
      console.error('Failed to log email:', error)
      throw error
    }
  }

  async getEmailStats(days = 7) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const stats = await prisma.emailLog.groupBy({
      by: ['emailType', 'success'],
      _count: {
        id: true
      },
      where: {
        sentAt: {
          gte: since
        }
      }
    })

    return stats
  }

  async getFailedEmails(limit = 50) {
    return await prisma.emailLog.findMany({
      where: {
        success: false
      },
      orderBy: {
        sentAt: 'desc'
      },
      take: limit,
      include: {
        waitlistEntry: {
          select: {
            email: true,
            position: true
          }
        }
      }
    })
  }

  async retryFailedEmails(emailIds: string[]) {
    // Mark failed emails for retry by clearing the error message
    const retryEmails = await prisma.emailLog.findMany({
      where: {
        id: { in: emailIds },
        success: false
      },
      include: {
        waitlistEntry: true
      }
    })

    return retryEmails
  }

  async markUnsubscribed(email: string) {
    try {
      const result = await prisma.waitlist.update({
        where: { email },
        data: { unsubscribed: true }
      })

      // Log the unsubscribe action
      await this.logEmail({
        recipientEmail: email,
        emailType: 'admin', // Using admin type for system actions
        success: true,
        waitlistId: result.id
      })

      return result
    } catch (error) {
      console.error('Failed to mark email as unsubscribed:', error)
      throw error
    }
  }

  async getActiveSubscribers() {
    return await prisma.waitlist.count({
      where: {
        unsubscribed: false
      }
    })
  }

  async checkMilestone(currentCount: number): Promise<number | null> {
    // Check if we've hit a milestone (every 1000)
    const milestone = Math.floor(currentCount / 1000) * 1000
    
    if (milestone === 0 || currentCount < milestone) {
      return null
    }

    // Check if we've already processed this milestone
    const existingMilestone = await prisma.milestoneTracking.findUnique({
      where: { milestone }
    })

    if (existingMilestone?.processed) {
      return null
    }

    // Create or update milestone tracking
    await prisma.milestoneTracking.upsert({
      where: { milestone },
      create: {
        milestone,
        processed: false
      },
      update: {
        processed: false
      }
    })

    return milestone
  }

  async markMilestoneProcessed(milestone: number, emailsSent: number, emailsFailed: number) {
    return await prisma.milestoneTracking.update({
      where: { milestone },
      data: {
        processed: true,
        emailsSent,
        emailsFailed
      }
    })
  }

  async checkAdminNotification(currentCount: number): Promise<number | null> {
    // Check if we've hit an admin notification threshold (every 100)
    const threshold = Math.floor(currentCount / 100) * 100
    
    if (threshold === 0 || currentCount < threshold) {
      return null
    }

    // Check if we've already sent notification for this threshold
    const existingNotification = await prisma.adminNotificationLog.findFirst({
      where: {
        notificationType: 'signups_100',
        triggerCount: threshold
      }
    })

    if (existingNotification) {
      return null
    }

    return threshold
  }

  async logAdminNotification(
    notificationType: string,
    triggerCount: number,
    recipients: string[],
    success: boolean,
    errorMessage?: string
  ) {
    return await prisma.adminNotificationLog.create({
      data: {
        notificationType,
        triggerCount,
        recipients: JSON.stringify(recipients),
        success,
        errorMessage
      }
    })
  }

  async getTopReferrers(limit = 10, days = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const topReferrers = await prisma.waitlist.findMany({
      where: {
        joinedAt: {
          gte: since
        }
      },
      include: {
        _count: {
          select: {
            referrals: true
          }
        }
      },
      orderBy: {
        referrals: {
          _count: 'desc'
        }
      },
      take: limit
    })

    return topReferrers.map(user => ({
      email: user.email,
      referralCount: user._count.referrals
    }))
  }

  async getRecentSignups(days = 7) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    return await prisma.waitlist.count({
      where: {
        joinedAt: {
          gte: since
        }
      }
    })
  }
}

// Export singleton instance
export const emailTracker = new EmailTracker()