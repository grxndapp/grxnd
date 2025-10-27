import {
  Body, Button, Container, Head, Html,
  Img, Link, Preview, Section, Text,
} from '@react-email/components';

interface WelcomeToGrxndEmailProps {
  username?: string;
  password?: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}`
  : '';

const features = [
   {
      name: "🤖 AI Quiz Maker",
      description: "Generate custom quizzes instantly from any topic or notes."
   },
   {
      name: "📝 AI Essay Grader",
      description: "Get instant feedback, scores, and improvement tips for your essays."
   },
   {
      name: "💬 AI Humanizer",
      description: "Rewrite AI text to sound more natural, human, and authentic."
   },
   {
      name: "💬 AI Humanizer",
      description: "Rewrite AI text to sound more natural, human, and authentic."
   },
   {
      name: "⚡ Other Cool AI Tools",
      description: "Explore study summaries, AI-powered learning insights and more to keep you ahead."
   }
];


export const WelcomeToGrxndEmail = ({ username, password }: WelcomeToGrxndEmailProps) => (
   <Html>
      <Head />
      <Body style={main}>
         <Preview>
            Your Grxnd Subscription Is Active - Let's Lock In 🔒
         </Preview>
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
                  Hey {(username == "" || !username) ? 'there' : (<strong>{username}</strong>)}!
               </Text>
               <Text style={text}>
                  Your Grxnd subscription for this month is active and your AI study tools are ready to go.
               </Text>
               <Text style={text}>Your subscription unlocks:</Text>
               <ul>
                  {features.map((feature, index) => (
                     <Text key={index} style={text}>
                        <strong>{feature.name}: </strong> {feature.description}
                     </Text>
                  ))}
               </ul>
               <Text style={text}>
                  You've officially locked in. It's time to study sharper, not harder.
               </Text>
               {(password || password !== "") && (<>
                  <br />
                  <Text style={text}>
                     <strong>To Login to your account:</strong>
                  </Text>
                  <Text style={text}>Here's your temporary password: {password}</Text>
                  <Text style={text}>
                     For your security, please change your password immediately click the button below:
                  </Text>
                  <Text style={text}>
                     <Link style={link} href={`${baseUrl}/change-password`} target='_blank'>
                        <Button style={button}>Change Password</Button>
                     </Link>
                  </Text>
                  <br />
                  <Text style={text}>
                     If the button above doesn't work use this link:
                  </Text>
                  <Text style={text}>
                     <Link style={link} href={`${baseUrl}/change-password`} target='_blank'>
                        {baseUrl}/change-password
                     </Link>
                  </Text>
               </>)}
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

export default WelcomeToGrxndEmail;

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
