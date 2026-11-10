import {
  Body, Button, Container, Head, Html,
  Img, Link, Preview, Section, Text,
} from '@react-email/components';

interface CreateAccountWelcomeEmailProps {
  username?: string;
}

const grxnd = {
  url: "https://grxnd.app/",
  logo: "https://grxnd.app/logo.png",
  feedback: "https://grxnd.app/feedback",
  pricing: "https://grxnd.app/pricing",
}

export const CreateAccountWelcomeEmail = ({ username }: CreateAccountWelcomeEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>
            Welcome to Grxnd! 👋
         </Preview>
         <Container style={container}>
            <Img src={grxnd.logo} width="50" height="50" alt="grxnd logo" />
            <br />

            <Section style={section}>
               <Text style={text}>
                  Hey {(username == "" || !username) ? 'there' : (<strong>{username}</strong>)}!
               </Text>
               <br />
               <Text style={text}>
                  Welcome to Grxnd! You're all set to explore the app right in your browser. Head over to grxnd.app and start discovering what's possible.
               </Text>
               <Text style={text}>
                  <Button style={button} href={`${grxnd.pricing}`} target='_blank'>Grxnd Now !</Button>
               </Text>
               <Text style={text}>
                  You've officially locked in. It's time to study smarter, not harder.
               </Text>
               <br />
               <Text style={text}>Cheers,</Text>
               <Text style={text}>The Grxnd Team</Text>
            </Section>

            <Text style={links}>
               <Link style={link} href={grxnd.feedback} target='_blank'>
                  Contact support
               </Link>
            </Text>
            <Text style={footer}><Link style={link} href={grxnd.url} target='_blank'>Grxnd</Link> ・ Glasgow, Scotland</Text>
         </Container>
      </Body>
   </Html>
);

export default CreateAccountWelcomeEmail;

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
