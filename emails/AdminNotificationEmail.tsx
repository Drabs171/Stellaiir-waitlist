import {
  Section,
  Row,
  Column,
  Text,
  Button,
} from '@react-email/components'
import EmailLayout from './components/EmailLayout'

export interface AdminNotificationEmailProps {
  totalSignups: number
  recentSignups: number
  topReferrers: Array<{
    email: string
    referralCount: number
  }>
  timeframe: string
}

export const AdminNotificationEmail = ({
  totalSignups,
  recentSignups,
  topReferrers,
  timeframe,
}: AdminNotificationEmailProps) => {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/dashboard`
  
  return (
    <EmailLayout 
      preview={`Stellaiir Waitlist Update: ${totalSignups} total signups, ${recentSignups} in the last ${timeframe}`}
    >
      {/* Header */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <Text style={heroTitleStyle}>
              📊 Stellaiir Waitlist Report
            </Text>
            <Text style={heroSubtitleStyle}>
              Waitlist growth summary for the last {timeframe}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Key Metrics */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={metricsContainerStyle}>
              <Text style={sectionTitleStyle}>
                📈 Key Metrics
              </Text>
              
              <div style={metricsGridStyle}>
                <div style={metricItemStyle}>
                  <Text style={metricNumberStyle}>{totalSignups.toLocaleString()}</Text>
                  <Text style={metricLabelStyle}>Total Signups</Text>
                  <Text style={metricDescStyle}>All-time waitlist members</Text>
                </div>
                
                <div style={metricItemStyle}>
                  <Text style={metricNumberStyle}>{recentSignups.toLocaleString()}</Text>
                  <Text style={metricLabelStyle}>New Signups</Text>
                  <Text style={metricDescStyle}>Last {timeframe}</Text>
                </div>
                
                <div style={metricItemStyle}>
                  <Text style={metricNumberStyle}>
                    {Math.round((recentSignups / totalSignups) * 100)}%
                  </Text>
                  <Text style={metricLabelStyle}>Growth Rate</Text>
                  <Text style={metricDescStyle}>Recent growth percentage</Text>
                </div>
                
                <div style={metricItemStyle}>
                  <Text style={metricNumberStyle}>
                    {topReferrers.reduce((sum, ref) => sum + ref.referralCount, 0)}
                  </Text>
                  <Text style={metricLabelStyle}>Total Referrals</Text>
                  <Text style={metricDescStyle}>From top referrers</Text>
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Growth Analysis */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={analysisContainerStyle}>
              <Text style={sectionTitleStyle}>
                📊 Growth Analysis
              </Text>
              
              <div style={analysisItemStyle}>
                <Text style={analysisLabelStyle}>Daily Average:</Text>
                <Text style={analysisValueStyle}>
                  {Math.round(recentSignups / (timeframe.includes('week') ? 7 : timeframe.includes('day') ? 1 : 30))} signups/day
                </Text>
              </div>
              
              <div style={analysisItemStyle}>
                <Text style={analysisLabelStyle}>Projected Monthly:</Text>
                <Text style={analysisValueStyle}>
                  {Math.round((recentSignups / (timeframe.includes('week') ? 7 : timeframe.includes('day') ? 1 : 30)) * 30).toLocaleString()} signups
                </Text>
              </div>
              
              <div style={analysisItemStyle}>
                <Text style={analysisLabelStyle}>Next Milestone:</Text>
                <Text style={analysIsValueStyle}>
                  {(Math.ceil(totalSignups / 1000) * 1000).toLocaleString()} members 
                  ({((Math.ceil(totalSignups / 1000) * 1000) - totalSignups).toLocaleString()} to go)
                </Text>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Top Referrers */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={referrersContainerStyle}>
              <Text style={sectionTitleStyle}>
                🏆 Top Referrers
              </Text>
              
              {topReferrers.length > 0 ? (
                <div style={referrersListStyle}>
                  {topReferrers.slice(0, 10).map((referrer, index) => (
                    <div key={referrer.email} style={referrerItemStyle}>
                      <div style={referrerRankStyle}>
                        <Text style={rankNumberStyle}>#{index + 1}</Text>
                      </div>
                      <div style={referrerInfoStyle}>
                        <Text style={referrerEmailStyle}>
                          {referrer.email.length > 30 
                            ? `${referrer.email.substring(0, 30)}...` 
                            : referrer.email
                          }
                        </Text>
                        <Text style={referrerCountStyle}>
                          {referrer.referralCount} referral{referrer.referralCount !== 1 ? 's' : ''}
                        </Text>
                      </div>
                      <div style={referrerBadgeStyle}>
                        <Text style={badgeTextStyle}>
                          {referrer.referralCount >= 10 ? '🔥' : referrer.referralCount >= 5 ? '⭐' : '👏'}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Text style={noDataStyle}>
                  No referral data available for this period.
                </Text>
              )}
            </div>
          </Column>
        </Row>
      </Section>

      {/* Action Items */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={actionItemsContainerStyle}>
              <Text style={sectionTitleStyle}>
                ⚡ Recommended Actions
              </Text>
              
              <div style={actionListStyle}>
                <div style={actionItemStyle}>
                  <Text style={actionIconStyle}>🎯</Text>
                  <div>
                    <Text style={actionTitleStyle}>Milestone Celebration</Text>
                    <Text style={actionDescStyle}>
                      {totalSignups >= (Math.floor(totalSignups / 1000) * 1000) 
                        ? `Send milestone email to celebrate ${Math.floor(totalSignups / 1000) * 1000} members!`
                        : `Prepare milestone email for ${Math.ceil(totalSignups / 1000) * 1000} members.`
                      }
                    </Text>
                  </div>
                </div>
                
                <div style={actionItemStyle}>
                  <Text style={actionIconStyle}>🏆</Text>
                  <div>
                    <Text style={actionTitleStyle}>Reward Top Referrers</Text>
                    <Text style={actionDescStyle}>
                      Consider reaching out to top referrers with special recognition or early access perks.
                    </Text>
                  </div>
                </div>
                
                <div style={actionItemStyle}>
                  <Text style={actionIconStyle}>📈</Text>
                  <div>
                    <Text style={actionTitleStyle}>Growth Optimization</Text>
                    <Text style={actionDescStyle}>
                      {recentSignups > 50 
                        ? "Strong growth! Consider increasing server capacity for launch."
                        : "Consider launching referral campaigns to boost signups."
                      }
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Quick Actions */}
      <Section>
        <Row>
          <Column>
            <div style={quickActionsStyle}>
              <Text style={sectionTitleStyle}>
                🚀 Quick Actions
              </Text>
              <div style={buttonsContainerStyle}>
                <Button
                  href={dashboardUrl}
                  style={primaryButtonStyle}
                >
                  View Full Dashboard
                </Button>
                <Button
                  href={`${dashboardUrl}/export`}
                  style={secondaryButtonStyle}
                >
                  Export Data
                </Button>
              </div>
            </div>
          </Column>
        </Row>
      </Section>
    </EmailLayout>
  )
}

// Styles
const heroTitleStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '0 0 12px 0',
}

const heroSubtitleStyle = {
  fontSize: '16px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '0',
}

const metricsContainerStyle = {
  backgroundColor: 'rgba(99, 102, 241, 0.05)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const sectionTitleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 20px 0',
}

const metricsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
}

const metricItemStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
}

const metricNumberStyle = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#6366f1',
  margin: '0 0 8px 0',
}

const metricLabelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 4px 0',
}

const metricDescStyle = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
}

const analysisContainerStyle = {
  backgroundColor: 'rgba(34, 211, 238, 0.05)',
  border: '1px solid rgba(34, 211, 238, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const analysisItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
}

const analysisLabelStyle = {
  fontSize: '14px',
  color: '#d1d5db',
  fontWeight: '500',
  margin: '0',
}

const analysisValueStyle = {
  fontSize: '14px',
  color: '#22d3ee',
  fontWeight: '600',
  margin: '0',
}

const analysIsValueStyle = {
  fontSize: '14px',
  color: '#22d3ee',
  fontWeight: '600',
  margin: '0',
}

const referrersContainerStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.05)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const referrersListStyle = {
  margin: '0',
}

const referrerItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 0',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
}

const referrerRankStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  backgroundColor: 'rgba(16, 185, 129, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

const rankNumberStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#10b981',
  margin: '0',
}

const referrerInfoStyle = {
  flex: 1,
}

const referrerEmailStyle = {
  fontSize: '14px',
  color: '#ffffff',
  margin: '0 0 2px 0',
}

const referrerCountStyle = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
}

const referrerBadgeStyle = {
  flexShrink: 0,
}

const badgeTextStyle = {
  fontSize: '16px',
  margin: '0',
}

const noDataStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  fontStyle: 'italic',
  margin: '20px 0',
}

const actionItemsContainerStyle = {
  backgroundColor: 'rgba(251, 191, 36, 0.05)',
  border: '1px solid rgba(251, 191, 36, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const actionListStyle = {
  margin: '0',
}

const actionItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '16px',
}

const actionIconStyle = {
  fontSize: '20px',
  flexShrink: 0,
}

const actionTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 4px 0',
}

const actionDescStyle = {
  fontSize: '14px',
  color: '#d1d5db',
  margin: '0',
  lineHeight: '20px',
}

const quickActionsStyle = {
  backgroundColor: 'rgba(139, 92, 246, 0.05)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
}

const buttonsContainerStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  flexWrap: 'wrap' as const,
}

const primaryButtonStyle = {
  backgroundColor: '#8b5cf6',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block',
}

const secondaryButtonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '600',
  display: 'inline-block',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}

export default AdminNotificationEmail