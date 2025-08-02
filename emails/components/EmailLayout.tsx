import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
  unsubscribeUrl?: string
}

export const EmailLayout = ({ preview, children, unsubscribeUrl }: EmailLayoutProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Row>
              <Column>
                <div style={logoContainerStyle}>
                  <div style={logoIconStyle}>🧬</div>
                  <Text style={logoTextStyle}>Stellaiir</Text>
                </div>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={contentStyle}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Hr style={hrStyle} />
            
            <Row style={{ marginBottom: '20px' }}>
              <Column>
                <Text style={footerTextStyle}>
                  You&apos;re receiving this email because you signed up for the Stellaiir waitlist.
                </Text>
                <Text style={footerTextStyle}>
                  Stellaiir - Revolutionizing genetic analysis with AI
                </Text>
                <Text style={footerTextStyle}>
                  San Francisco, CA
                </Text>
              </Column>
            </Row>

            {unsubscribeUrl && (
              <Row>
                <Column>
                  <Text style={footerTextStyle}>
                    <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
                      Unsubscribe from these emails
                    </Link>
                  </Text>
                </Column>
              </Row>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const bodyStyle = {
  backgroundColor: '#0f0f0f',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: 0,
  padding: 0,
}

const containerStyle = {
  backgroundColor: '#0f0f0f',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '20px',
}

const headerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '16px 16px 0 0',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderBottom: 'none',
  padding: '24px',
  backdropFilter: 'blur(10px)',
}

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
}

const logoIconStyle = {
  fontSize: '32px',
  filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))',
}

const logoTextStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#ffffff',
  margin: 0,
  background: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const contentStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderTop: 'none',
  borderBottom: 'none',
  padding: '32px 24px',
  backdropFilter: 'blur(10px)',
}

const footerStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderTop: 'none',
  borderRadius: '0 0 16px 16px',
  padding: '24px',
  backdropFilter: 'blur(10px)',
}

const hrStyle = {
  border: 'none',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  margin: '0 0 20px 0',
}

const footerTextStyle = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '4px 0',
  textAlign: 'center' as const,
}

const unsubscribeLinkStyle = {
  color: '#6366f1',
  textDecoration: 'underline',
}

export default EmailLayout