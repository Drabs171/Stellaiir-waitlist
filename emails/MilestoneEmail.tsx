import {
  Section,
  Row,
  Column,
  Text,
  Button,
} from '@react-email/components'
import EmailLayout from './components/EmailLayout'

export interface MilestoneEmailProps {
  milestone: number
  totalUsers: number
  userPosition: number
  email: string
}

export const MilestoneEmail = ({
  milestone,
  totalUsers,
  userPosition,
  email,
}: MilestoneEmailProps) => {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(email)}`
  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`
  
  return (
    <EmailLayout 
      preview={`🎉 Stellaiir hits ${milestone.toLocaleString()} members! See what's coming next.`}
      unsubscribeUrl={unsubscribeUrl}
    >
      {/* Celebration Hero */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={celebrationStyle}>
              <Text style={celebrationEmojiStyle}>🎉✨🚀</Text>
              <Text style={heroTitleStyle}>
                We Hit {milestone.toLocaleString()} Members!
              </Text>
              <Text style={heroSubtitleStyle}>
                Thanks to amazing people like you, the Stellaiir community is growing rapidly!
              </Text>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Stats Section */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={statsContainerStyle}>
              <Text style={sectionTitleStyle}>
                📊 Community Growth
              </Text>
              <div style={statsGridStyle}>
                <div style={statItemStyle}>
                  <Text style={statNumberStyle}>{totalUsers.toLocaleString()}</Text>
                  <Text style={statLabelStyle}>Total Members</Text>
                </div>
                <div style={statItemStyle}>
                  <Text style={statNumberStyle}>#{userPosition.toLocaleString()}</Text>
                  <Text style={statLabelStyle}>Your Position</Text>
                </div>
                <div style={statItemStyle}>
                  <Text style={statNumberStyle}>{Math.round((milestone / totalUsers) * 100)}%</Text>
                  <Text style={statLabelStyle}>Growth Rate</Text>
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* What This Means */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <Text style={sectionTitleStyle}>
              🔬 What This Milestone Means
            </Text>
            <div style={milestoneContainerStyle}>
              <div style={milestoneListStyle}>
                <div style={milestoneItemStyle}>
                  <Text style={milestoneIconStyle}>⚡</Text>
                  <Text style={milestoneTextStyle}>
                    <strong>Faster Development:</strong> More demand means we&apos;re accelerating our development timeline.
                  </Text>
                </div>
                <div style={milestoneItemStyle}>
                  <Text style={milestoneIconStyle}>🎯</Text>
                  <Text style={milestoneTextStyle}>
                    <strong>Better Features:</strong> Your feedback is helping us build exactly what you need.
                  </Text>
                </div>
                <div style={milestoneItemStyle}>
                  <Text style={milestoneIconStyle}>🤝</Text>
                  <Text style={milestoneTextStyle}>
                    <strong>Strong Community:</strong> You&apos;re part of a growing movement in personalized healthcare.
                  </Text>
                </div>
                <div style={milestoneItemStyle}>
                  <Text style={milestoneIconStyle}>🚀</Text>
                  <Text style={milestoneTextStyle}>
                    <strong>Earlier Access:</strong> We&apos;re planning to expand our beta program sooner than expected!
                  </Text>
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Development Update */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={updateContainerStyle}>
              <Text style={sectionTitleStyle}>
                🛠️ Development Update
              </Text>
              <Text style={updateTextStyle}>
                We&apos;re making incredible progress on the Stellaiir platform. Here&apos;s what we&apos;ve been working on:
              </Text>
              
              <div style={progressContainerStyle}>
                <div style={progressItemStyle}>
                  <div style={progressHeaderStyle}>
                    <Text style={progressTitleStyle}>AI Analysis Engine</Text>
                    <Text style={progressStatusStyle}>✅ Complete</Text>
                  </div>
                  <Text style={progressDescStyle}>
                    Our core AI algorithms can now process genetic data 10x faster than traditional methods.
                  </Text>
                </div>
                
                <div style={progressItemStyle}>
                  <div style={progressHeaderStyle}>
                    <Text style={progressTitleStyle}>Security & Privacy Framework</Text>
                    <Text style={progressStatusStyle}>🔄 90% Complete</Text>
                  </div>
                  <Text style={progressDescStyle}>
                    Zero-knowledge architecture ensures your genetic data remains completely private.
                  </Text>
                </div>
                
                <div style={progressItemStyle}>
                  <div style={progressHeaderStyle}>
                    <Text style={progressTitleStyle}>User Interface</Text>
                    <Text style={progressStatusStyle}>🎨 In Progress</Text>
                  </div>
                  <Text style={progressDescStyle}>
                    Beautiful, intuitive dashboard that makes complex genetic insights easy to understand.
                  </Text>
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Referral Reminder */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={referralReminderStyle}>
              <Text style={sectionTitleStyle}>
                🔥 Still Want to Move Up Faster?
              </Text>
              <Text style={referralTextStyle}>
                Every milestone brings us closer to launch! Refer friends to move up in the waitlist and help us build an even stronger community.
              </Text>
              <div style={referralStatsStyle}>
                <Text style={referralStatsTextStyle}>
                  <strong>Current Position:</strong> #{userPosition.toLocaleString()} 
                  <br />
                  <strong>Referrals needed to move up 3 spots:</strong> 3 friends
                </Text>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Call to Action */}
      <Section>
        <Row>
          <Column>
            <div style={ctaContainerStyle}>
              <Text style={ctaTitleStyle}>
                Help Us Reach the Next Milestone!
              </Text>
              <Text style={ctaDescStyle}>
                Share Stellaiir with friends who care about their health and genetic insights.
              </Text>
              <Button
                href={referralUrl}
                style={ctaButtonStyle}
              >
                Get Your Referral Link
              </Button>
              <Text style={ctaFooterStyle}>
                Next milestone: {(Math.ceil(totalUsers / 1000) * 1000 + 1000).toLocaleString()} members
              </Text>
            </div>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  )
}

// Styles
const celebrationStyle = {
  textAlign: 'center' as const,
  padding: '20px',
  backgroundColor: 'rgba(99, 102, 241, 0.05)',
  borderRadius: '12px',
  border: '1px solid rgba(99, 102, 241, 0.2)',
}

const celebrationEmojiStyle = {
  fontSize: '48px',
  margin: '0 0 16px 0',
}

const heroTitleStyle = {
  fontSize: '36px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 16px 0',
  background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const heroSubtitleStyle = {
  fontSize: '18px',
  color: '#d1d5db',
  margin: '0',
  lineHeight: '28px',
}

const statsContainerStyle = {
  backgroundColor: 'rgba(34, 211, 238, 0.05)',
  border: '1px solid rgba(34, 211, 238, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const sectionTitleStyle = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 20px 0',
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
}

const statItemStyle = {
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
}

const statNumberStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#22d3ee',
  margin: '0 0 8px 0',
}

const statLabelStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
}

const milestoneContainerStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.05)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const milestoneListStyle = {
  margin: '0',
}

const milestoneItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '16px',
}

const milestoneIconStyle = {
  fontSize: '20px',
  flexShrink: 0,
}

const milestoneTextStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0',
  lineHeight: '24px',
}

const updateContainerStyle = {
  backgroundColor: 'rgba(139, 92, 246, 0.05)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const updateTextStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0 0 24px 0',
  lineHeight: '24px',
}

const progressContainerStyle = {
  margin: '0',
}

const progressItemStyle = {
  marginBottom: '20px',
  paddingBottom: '16px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}

const progressHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
}

const progressTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0',
}

const progressStatusStyle = {
  fontSize: '14px',
  color: '#10b981',
  margin: '0',
}

const progressDescStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  margin: '0',
  lineHeight: '20px',
}

const referralReminderStyle = {
  backgroundColor: 'rgba(251, 191, 36, 0.05)',
  border: '1px solid rgba(251, 191, 36, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const referralTextStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0 0 16px 0',
  lineHeight: '24px',
}

const referralStatsStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '16px',
}

const referralStatsTextStyle = {
  fontSize: '14px',
  color: '#fbbf24',
  margin: '0',
  lineHeight: '20px',
}

const ctaContainerStyle = {
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  border: '2px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
}

const ctaTitleStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 12px 0',
}

const ctaDescStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0 0 24px 0',
  lineHeight: '24px',
}

const ctaButtonStyle = {
  backgroundColor: '#6366f1',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  display: 'inline-block',
  marginBottom: '16px',
}

const ctaFooterStyle = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
}

export default MilestoneEmail