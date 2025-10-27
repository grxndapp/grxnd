import {
  Body, Button, Container, Head, Html,
  Img, Link, Preview, Section, Text,
} from '@react-email/components';

interface CancelledSubscriptionEmailProps {
  username: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}`
  : '';

export const CancelledSubscriptionEmail = ({ username }: CancelledSubscriptionEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>
            Your Grxnd Subscription Has Been Cancelled
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
                  We've confirmed that your Grxnd subscription has been cancelled. You'll still have access until the end of your current billing period, after which your premium features - including AI tools like the Quiz Maker, Essay Grader, and Humanizer. These features will be locked.
               </Text>
               <Text style={text}>We're genuinely grateful you gave us a shot. If you have a minute, we'd love to know why you cancelled. Your feedback helps us improve.</Text>
               <Text style={text}>
                  <Link style={link} href={`${process.env.NEXTAUTH_URL}/feedback`} target='_blank'>
                     Share Feedback
                  </Link>
               </Text>
               <Text style={text}>And if you ever decide to come back, your account and progress will be waiting for you.</Text>
               <Text style={text}>Until then, keep learning smart.</Text>
               <Text style={text}>Cheers,</Text>
               <Text style={text}>The Grxnd Team</Text>
            </Section>

            <Text style={footer}>Grxnd ・ Glasgow, Scotland</Text>
         </Container>
      </Body>
   </Html>
);

export default CancelledSubscriptionEmail;

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
