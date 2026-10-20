import {
  Body, Button, Container, Head, Html,
  Img, Link, Preview, Section, Text,
} from '@react-email/components';

interface FreeSubscriptionTestEmailProps {
  username?: string;
}

const features = [
   {
      name: "🤖 AI Quiz Maker",
      description: "Generate custom quizzes instantly from any topic or notes."
   },
   {
      name: "🤖 AI Note Taker",
      description: "Take notes in class without even being there (as long as you get the pdfs)."
   },
   {
      name: "📝 AI Essay Grader",
      description: "Get instant feedback, scores, and improvement tips for your essays."
   },
   {
      name: "⚡ Other Cool Features (There are Easter Eggs)",
      description: "Explore study summaries, AI-powered learning insights and more to keep you ahead."
   }
];

const grxnd = {
  url: "https://grxnd.app/",
  logo: "https://grxnd.app/logo.png",
  feedback: "https://grxnd.app/feedback",
}

export const FreeSubscriptionTestEmail = ({ username }: FreeSubscriptionTestEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>
            Your Free Grxnd Subscription - Help Us Out 🔒
         </Preview>
         <Container style={container}>
            <Img
               src={grxnd.logo}
               width="50"
               height="50"
               alt="grxnd logo"
            />

            <Text style={title}>
               <strong>@{username}</strong>, welcome to Grxnd.
            </Text>

            <Section style={section}>
               <Text style={text}>
                  Hey {(username == "" || !username) ? 'there' : (<strong>{username}</strong>)}!
               </Text>
               <Text style={text}>
                  As generous as <strong>Grxnd</strong> are, we have decided to give you a <strong>FREE SUBSCRIPTION</strong> to use our app and give us feedback.
               </Text>
               <Text style={text}>
                  <strong>This is a limited offer for 7 days</strong> and we <strong style={{color:'red'}}>require</strong> you to provide some feedback after the 7 days.
               </Text>
               <Text style={text}>The subscription give you access to:</Text>
               <ul>
                  {features.map((feature, index) => (
                     <Text key={index} style={text}>
                        <strong>{feature.name}: </strong> {feature.description}
                     </Text>
                  ))}
               </ul>
               <Text style={text}>
                  Since you're here, you can promote <strong>Grxnd</strong> on your socials which can <strong>extend</strong> your free subscription based on how many referrals you bring.
               </Text>
               <Text style={text}>
                  <strong>If you're interested,</strong> reply to this email saying "Absolutely" with any emoji of your choice. If we don't receive an email from you in the next <strong>48 hours</strong> we will take away the free subscription.
               </Text>
               <Text style={text}>
                  Good luck!
               </Text>
               <br />
               <Text style={text}>
                  <Button style={button} href={`${grxnd.url}home`} target='_blank'>Enjoy My Free Gift</Button>
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

export default FreeSubscriptionTestEmail;

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
