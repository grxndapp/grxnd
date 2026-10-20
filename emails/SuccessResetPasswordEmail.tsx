import {
  Body, Container, Head, Html, Link,
  Img, Preview, Section, Text,
  Button,
} from '@react-email/components';

interface SuccessResetPasswordProps {
  username: string;
}

const grxnd = {
  url: "https://grxnd.app/",
  logo: "https://grxnd.app/logo.png",
  feedback: "https://grxnd.app/feedback",
}

export const SuccessResetPasswordEmail = ({ username }: SuccessResetPasswordProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>
            Successfully Reset Your Grxnd Password
         </Preview>
         <Container style={container}>
            <Img
               src={grxnd.logo}
               width="50"
               height="50"
               alt="grxnd logo"
            />
            <br />

            <Section style={section}>
               <Text style={text}>
                  Hey <strong>{username || 'there'}</strong>,
               </Text>
               <Text style={text}>
                  Your Grxnd password has been reset successfully !
               </Text>
               <Text style={text}>Stay Sharp,</Text>
               <Text style={text}>The Grxnd Team</Text>
            </Section>

            <Text style={footer}><Link style={link} href={grxnd.url} target='_blank'>Grxnd</Link> ・ Glasgow, Scotland</Text>
         </Container>
      </Body>
   </Html>
);

export default SuccessResetPasswordEmail;

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
