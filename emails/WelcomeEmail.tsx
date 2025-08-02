import {
  Section,
  Row,
  Column,
  Text,
  Button,
  Link,
} from '@react-email/components'
import EmailLayout from './components/EmailLayout'

export interface WelcomeEmailProps {
  email: string
  position: number
  referralCode: string
  referralUrl: string
  joinedAt: string
}

export const WelcomeEmail = ({
  email,
  position,
  referralCode,
  referralUrl,
  joinedAt,
}: WelcomeEmailProps) => {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(email)}`
  
  return (
    <EmailLayout 
      preview={`Welcome to Stellaiir! You're #${position.toLocaleString()} in line.`}
      unsubscribeUrl={unsubscribeUrl}
    >
      {/* Welcome Hero */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <Text style={heroTitleStyle}>
              🎉 Welcome to Stellaiir!
            </Text>
            <Text style={heroSubtitleStyle}>
              You&apos;re successfully on the waitlist for early access to AI-powered genetic analysis.
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Position Badge */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={positionBadgeStyle}>
              <Text style={positionLabelStyle}>Your Position</Text>
              <Text style={positionNumberStyle}>
                #{position.toLocaleString()}
              </Text>
              <Text style={positionDescStyle}>
                You&apos;re ahead of thousands of others!
              </Text>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Referral Section */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <div style={referralContainerStyle}>
              <Text style={sectionTitleStyle}>
                🚀 Move Up Faster with Referrals
              </Text>
              <Text style={referralDescStyle}>
                Refer 3 friends and move up 3 spots in the waitlist! Share your unique referral link:
              </Text>
              
              <div style={referralLinkContainerStyle}>
                <Text style={referralLinkStyle}>
                  {referralUrl}
                </Text>
              </div>
              
              <div style={socialButtonsStyle}>
                <Link
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `🧬 Just joined the Stellaiir waitlist! Get early access to AI-powered genetic analysis and unlock your genetic potential. Join me: ${referralUrl}`
                  )}`}
                  style={socialButtonStyle}
                >
                  Share on Twitter
                </Link>
                <Link
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`}
                  style={socialButtonStyle}
                >
                  Share on LinkedIn
                </Link>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* What's Next Section */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <Text style={sectionTitleStyle}>
              ⏰ What&apos;s Next?
            </Text>
            <div style={timelineStyle}>
              <div style={timelineItemStyle}>
                <div style={timelineIconStyle}>✅</div>
                <div>
                  <Text style={timelineTextStyle}>
                    <strong>You&apos;re in!</strong> We&apos;ve secured your spot on the waitlist.
                  </Text>
                </div>
              </div>
              <div style={timelineItemStyle}>
                <div style={timelineIconStyle}>🔬</div>
                <div>
                  <Text style={timelineTextStyle}>
                    <strong>Development Updates:</strong> We&apos;ll send periodic updates on our progress.
                  </Text>
                </div>
              </div>
              <div style={timelineItemStyle}>
                <div style={timelineIconStyle}>🎯</div>
                <div>
                  <Text style={timelineTextStyle}>
                    <strong>Early Access:</strong> You&apos;ll get an email when it&apos;s your turn to join the beta.
                  </Text>
                </div>
              </div>
              <div style={timelineItemStyle}>
                <div style={timelineIconStyle}>🚀</div>
                <div>
                  <Text style={timelineTextStyle}>
                    <strong>Launch:</strong> Be among the first to experience the future of genetic analysis.
                  </Text>
                </div>
              </div>
            </div>
          </Column>
        </Row>
      </Section>

      {/* Features Preview */}
      <Section style={{ marginBottom: '32px' }}>
        <Row>
          <Column>
            <Text style={sectionTitleStyle}>
              🔬 What You&apos;ll Get Access To
            </Text>
            <div style={featuresGridStyle}>
              <div style={featureItemStyle}>
                <Text style={featureIconStyle}>🧬</Text>
                <Text style={featureTitleStyle}>AI-Powered Analysis</Text>
                <Text style={featureDescStyle}>
                  Advanced algorithms identify genetic mutations and health risks with unprecedented accuracy.
                </Text>
              </div>
              <div style={featureItemStyle}>
                <Text style={featureIconStyle}>📊</Text>
                <Text style={featureTitleStyle}>Personalized Protocols</Text>
                <Text style={featureDescStyle}>
                  Get custom supplement and lifestyle recommendations tailored to your unique genetic profile.
                </Text>
              </div>
              <div style={featureItemStyle}>
                <Text style={featureIconStyle}>🛡️</Text>
                <Text style={featureTitleStyle}>Privacy First</Text>
                <Text style={featureDescStyle}>
                  Your genetic data is encrypted and never shared. Zero-knowledge architecture ensures privacy.
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
                Ready to unlock your genetic potential?
              </Text>
              <Button
                href={referralUrl}
                style={ctaButtonStyle}
              >
                Share Your Referral Link
              </Button>
              <Text style={ctaSubtitleStyle}>
                The more friends you refer, the faster you&apos;ll get access!
              </Text>
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
  margin: '0 0 16px 0',
  background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const heroSubtitleStyle = {
  fontSize: '18px',
  color: '#d1d5db',
  textAlign: 'center' as const,
  margin: '0',
  lineHeight: '28px',
}

const positionBadgeStyle = {
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  border: '2px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '16px',
  padding: '24px',
  textAlign: 'center' as const,
}

const positionLabelStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px 0',
}

const positionNumberStyle = {
  fontSize: '48px',
  fontWeight: '700',
  color: '#6366f1',
  margin: '0 0 8px 0',
}

const positionDescStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0',
}

const referralContainerStyle = {
  backgroundColor: 'rgba(34, 211, 238, 0.05)',
  border: '1px solid rgba(34, 211, 238, 0.2)',
  borderRadius: '12px',
  padding: '24px',
}

const sectionTitleStyle = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 16px 0',
}

const referralDescStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0 0 20px 0',
  lineHeight: '24px',
}

const referralLinkContainerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '20px',
}

const referralLinkStyle = {
  fontSize: '14px',
  color: '#22d3ee',
  fontFamily: 'monospace',
  margin: '0',
  wordBreak: 'break-all' as const,
}

const socialButtonsStyle = {
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
}

const socialButtonStyle = {
  backgroundColor: '#6366f1',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
}

const timelineStyle = {
  marginTop: '16px',
}

const timelineItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '16px',
}

const timelineIconStyle = {
  fontSize: '20px',
  flexShrink: 0,
}

const timelineTextStyle = {
  fontSize: '16px',
  color: '#d1d5db',
  margin: '0',
  lineHeight: '24px',
}

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
  marginTop: '16px',
}

const featureItemStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
}

const featureIconStyle = {
  fontSize: '32px',
  margin: '0 0 12px 0',
}

const featureTitleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 8px 0',
}

const featureDescStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  margin: '0',
  lineHeight: '20px',
}

const ctaContainerStyle = {
  backgroundColor: 'rgba(16, 185, 129, 0.05)',
  border: '1px solid rgba(16, 185, 129, 0.2)',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
}

const ctaTitleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 20px 0',
}

const ctaButtonStyle = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  padding: '16px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
  display: 'inline-block',
  marginBottom: '16px',
}

const ctaSubtitleStyle = {
  fontSize: '14px',
  color: '#9ca3af',
  margin: '0',
}

export default WelcomeEmail