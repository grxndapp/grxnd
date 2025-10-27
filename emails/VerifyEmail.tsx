import {
  Body, Button, Container, Head, Html,
  Img, Link, Preview, Section, Text,
} from '@react-email/components';

interface VerifyEmailProps {
  username?: string;
  verifyLink?: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}`
  : '';

export const VerifyEmail = ({ username, verifyLink }: VerifyEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>Verify Your Grxnd Account</Preview>
         <Container style={container}>
            <Img
               src={`${baseUrl}/logo.png`}
               width="32"
               height="32"
               alt="Github"
            />

            <Text style={title}>
               <strong>@{username}</strong>, welcome to Grxnd.
            </Text>

            <Section style={section}>
               <Text style={text}>
                  Hey <strong>{username}</strong>,
               </Text>
               <Text style={text}>
                  To activate your account, please verify your email address by clicking the link below:
               </Text>
               <Text style={text}>
                  <Link style={link} href={verifyLink} target='_blank'>
                     <Button style={button}>Change Password</Button>
                  </Link>
               </Text>
               <br />
               <Text style={text}>
                  If the button above doesn't work use this link:
               </Text>
               <Text style={text}>
                  <Link style={link} href={verifyLink} target='_blank'>
                     {verifyLink}
                  </Link>
               </Text>
               <br />
               <Text style={text}>Cheers,</Text>
               <Text style={text}>The Grxnd Team</Text>
            </Section>

            <Text style={links}>
               <Link style={link} href={`${baseUrl}/feedback`} target='_blank'>
                  Contact support
               </Link>
            </Text>

            <Text style={footer}>Grxnd ・ Glasgow, Scotland</Text>
         </Container>
      </Body>
   </Html>
);

export default VerifyEmail;

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
