import React from "react";

interface IconProps {
  className?: string;
}

export const Icons: { [key: string]: React.FC<IconProps> } = {
  googleDrive: ({ className }) => (
    <img
      className={className}
      src="/googleDrive.png"
      alt="Google Drive"
    />
  ),
  
  hubspot: ({ className }) => (
    <img
      className={className}
      src="/brands/hubspot.svg"
      alt="Google Drive"
    />
  ),

  gmail: ({ className }) => (
    <img
      className={className}
      src="/brands/gmail.webp"
      alt="Google Drive"
    />
  ),
  dailyai: ({ className }) => (
    <img
      className={className}
      src="/brands/dailyai.png"
      alt="Daily ai"
    />
  ),
  openai: ({ className }) => (
    <img
      className={className}
      src="/brands/openai.png"
      alt="Open AI"
    />
  ),
  discord: ({ className }) => (
    <img
      className={className}
      src="/discord.png"
      alt="Discord"
    />
  ),
  whatsapp: ({ className }) => (
    <img
      className={className}
      src="/whatsapp.png"
      alt="WhatsApp"
    />
  ),
  notion: ({ className }) => (
    <img
      className={className}
      src="/notion.png"
      alt="Notion"
    />
  ),
  slack: ({ className }) => (
    <img
      className={className}
      src="/slack.png"
      alt="Slack"
    />
  ),
  zapllo: ({ className }) => (
    <img
      className={className}
      src="/Favicon.png"
      alt="Zapllo"
    />
  ),
  user: ({ className }) => (
    <img
      className={className}
      src="/logo.png"
      alt="User"
    />
  ),
  jira: ({ className }) => (
    <img
      className={className}
      src="/brands/jira.png"
      alt="User"
    />
  ),
  jotform: ({ className }) => (
    <img
      className={className}
      src="/brands/jotform.png"
      alt="User"
    />
  )
};
