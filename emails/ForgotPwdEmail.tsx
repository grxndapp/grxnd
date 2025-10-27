import {
  Body, Container, Head, Html,
  Img, Preview, Section, Text,
} from '@react-email/components';

interface ForgotPwdEmailProps {
  username: string;
  code: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}`
  : '';

export const ForgotPwdEmail = ({ username, code }: ForgotPwdEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>
            Reset Your Grxnd Password
         </Preview>
         <Container style={container}>
            <Img
               src={`${baseUrl}/logo.png`}
               width="32"
               height="32"
               alt="Github"
            />
            <br />

            <Section style={section}>
               <Text style={text}>
                  Hey <strong>{username || 'Kevin'}</strong>,
               </Text>
               <Text style={text}>
                  We received a request to reset your Grxnd password.
               </Text>
               <Text style={text}>To continue, enter the code below on the password reset page:</Text>
               <Text style={text}>
                  <strong>{code}</strong>
               </Text>
					<Text style={text}>
						This code will expire in <strong>10 minutes</strong> for your security.
					</Text>
               <Text style={text}>If you didn't request a password reset, you can safely ignore this email. Your account is still secure.</Text>
               <Text style={text}>Stay Sharp,</Text>
               <Text style={text}>The Grxnd Team</Text>
            </Section>

            <Text style={footer}>Grxnd ・ Glasgow, Scotland</Text>
         </Container>
      </Body>
   </Html>
);

export default ForgotPwdEmail;

const main = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const title = {
  fontSize: '24px',
  lineHeight: 1.25,
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const text = {
  margin: '0 0 10px 0',
  textAlign: 'left' as const,
};

const button = {
  fontSize: '14px',
  backgroundColor: '#1131ff',
  color: '#fff',
  lineHeight: 1.5,
  borderRadius: '0.5em',
  padding: '12px 24px',
};

const links = {
  textAlign: 'center' as const,
};

const link = {
  color: '#006eecff',
  fontSize: '12px',
};

const footer = {
  color: '#6a737d',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '60px',
};
