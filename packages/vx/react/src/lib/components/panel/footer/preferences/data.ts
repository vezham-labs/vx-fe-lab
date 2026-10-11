import { AccountSettings } from './user-settings/account'
import { ContentSocialSettings } from './user-settings/content-social'
import { PrivacySettings } from './user-settings/data-privacy'
import { FamilyCenterSettings } from './user-settings/family-center'
import { ProfileSettings } from './user-settings/profiles'

export type SidebarItem = {
  id: string
  label: string
  icon?: string
  href?: string
  component?: React.ComponentType
  children?: SidebarItem[]
}

export type SidebarSection = {
  title: string
  items: SidebarItem[]
}

export const settingsSidebar: SidebarSection[] = [
  {
    title: '',
    items: [
      {
        id: 'profiles',
        label: 'Arya Chan',
        component: ProfileSettings
      }
    ]
  },

  {
    title: 'USER SETTINGS',
    items: [
      {
        id: 'account',
        label: 'My Account',
        icon: 'vx:user',
        component: AccountSettings
      },
      {
        id: 'content-social',
        label: 'Content & Social',
        icon: 'vx:share',
        component: ContentSocialSettings
      },
      {
        id: 'privacy',
        label: 'Data & Privacy',
        icon: 'vx:shield-check',
        component: PrivacySettings,
        children: [
          {
            id: 'privacy-data',
            label: 'How Discord Uses Your Data'
          },
          {
            id: 'privacy-request',
            label: 'Request your Data'
          }
        ]
      },
      {
        id: 'family-center',
        label: 'Family Center',
        icon: 'vx:devices',
        component: FamilyCenterSettings
      },
      {
        id: 'authorized-apps',
        label: 'Authorized Apps',
        icon: 'vx:devices'
      },
      {
        id: 'devices',
        label: 'Devices',
        icon: 'vx:devices'
      },
      {
        id: 'connections',
        label: 'Connections',
        icon: 'vx:devices'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'vx:devices',
        children: [
          {
            id: 'notifications-overview',
            label: 'Overview'
          },
          {
            id: 'notifications-sounds',
            label: 'Sounds'
          },
          {
            id: 'notifications-badges',
            label: 'Badges'
          },
          {
            id: 'notifications-email',
            label: 'Email'
          },
          {
            id: 'notifications-advanced',
            label: 'Advanced'
          }
        ]
      }
    ]
  },

  {
    title: 'BILLING SETTINGS',
    items: [
      {
        id: 'nitro',
        label: 'Nitro',
        icon: 'vx:star'
      },
      {
        id: 'server-boost',
        label: 'Server Boost',
        icon: 'vx:card'
      },
      {
        id: 'subscriptions',
        label: 'Subscriptions',
        icon: 'vx:card'
      },
      {
        id: 'gift-inventory',
        label: 'Gift Inventory',
        icon: 'vx:card'
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'vx:wallet',
        children: [
          {
            id: 'billing-payment-methods',
            label: 'Payment Methods'
          },
          {
            id: 'billing-transaction-history',
            label: 'Transaction History'
          }
        ]
      }
    ]
  },

  {
    title: 'APP SETTINGS',
    items: [
      {
        id: 'appearance',
        label: 'Appearance',
        icon: 'vx:palette',
        children: [
          {
            id: 'appearance-theme',
            label: 'Theme'
          },
          {
            id: 'appearance-in-appicon',
            label: 'In-app Icon'
          },
          {
            id: 'appearance-ui-density',
            label: 'UI Density'
          },
          {
            id: 'appearance-message-spacing',
            label: 'Message Spacing'
          },
          {
            id: 'appearance-scaling',
            label: 'Scaling'
          }
        ]
      },
      {
        id: 'accessibility',
        label: 'Accessibility',
        icon: 'vx:videocamera',
        children: [
          {
            id: 'accessibility-colors',
            label: 'Colors & Saturation'
          },
          {
            id: 'accessibility-profile',
            label: 'Profile Colors'
          },
          {
            id: 'accessibility-contrast',
            label: 'Contrast'
          },
          {
            id: 'accessibility-reducedmotion',
            label: 'Reduced Motion'
          },
          {
            id: 'accessibility-chatinput',
            label: 'Chat Input'
          },
          {
            id: 'accessbility-textspeech',
            label: 'Text Speech'
          }
        ]
      },
      {
        id: 'voice-video',
        label: 'Voice & Video',
        icon: 'vx:videocamera',
        children: [
          {
            id: 'voicevideo-camera',
            label: 'Camera'
          },
          {
            id: 'voicevideo-streaming',
            label: 'Streaming'
          },
          {
            id: 'voicevideo-sounds',
            label: 'Sounds'
          },
          {
            id: 'voicevideo-soundboard',
            label: 'Soundboard'
          },
          {
            id: 'voicevideo-advanced',
            label: 'Advanced'
          }
        ]
      },
      {
        id: 'chat',
        label: 'Chat',
        icon: 'vx:chat-round-dots',
        children: [
          {
            id: 'chat-media',
            label: 'Media'
          },
          {
            id: 'chat-embeds',
            label: 'Embeds and Link Previews'
          },
          {
            id: 'chat-emoji',
            label: 'Emoji'
          },
          {
            id: 'chat-stickers',
            label: 'Stickers'
          },
          {
            id: 'chat-textbox',
            label: 'Text box'
          },
          {
            id: 'chat-threads',
            label: 'Threads'
          }
        ]
      },
      {
        id: 'keybinds',
        label: 'Keybinds',
        icon: 'vx:settings'
      },
      {
        id: 'language-time',
        label: 'Language & Time',
        icon: 'vx:settings'
      },
      {
        id: 'streamer-mode',
        label: 'Streamer Mode',
        icon: 'vx:settings'
      },
      {
        id: 'advanced',
        label: '... Advanced',
        icon: 'vx:settings'
      }
    ]
  },

  {
    title: 'ACTIVITY SETTINGS',
    items: [
      {
        id: 'activity',
        label: 'Activity Privacy',
        icon: 'vx:palette',
        children: [
          {
            id: 'activity-sharing',
            label: 'Activity Sharing'
          },
          {
            id: 'activity-servers',
            label: 'Servers I Share With'
          },
          {
            id: 'activity-games',
            label: 'Who Can Join My Games'
          }
        ]
      }
    ]
  },

  {
    title: '',
    items: [
      {
        id: 'logout',
        label: 'Log Out',
        icon: 'vx:palette'
      }
    ]
  }
]
