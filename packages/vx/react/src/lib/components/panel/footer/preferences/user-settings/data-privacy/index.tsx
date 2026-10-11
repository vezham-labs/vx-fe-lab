'use client'

import { Switch } from '@vezham/react-v3'

const items = [
  {
    title: 'Use data to improve Discord',
    desc: 'Allows us to use and process your information to understand and improve our services.'
  },
  {
    title: 'Use my Discord activity to personalize Sponsored Content',
    desc: 'Allows us to personalize Sponsored Content like Quests using your activity.'
  },
  {
    title: 'Use third-party data to personalize Sponsored Content',
    desc: 'Allows us to personalize Sponsored Content using third-party data.'
  },
  {
    title: 'Use data to personalize my Discord experience',
    desc: 'Allows us to use info like who you talk to and what you play.'
  },
  {
    title: 'Allow my voice to be recorded in Clips',
    desc: 'Your voice may be included when someone uses Clips.'
  },
  {
    title: 'Use data to make Discord work',
    desc: 'We need to process some data to provide core features.'
  }
]

const PrivacySettings = () => {
  return (
    <div id="privacy" className="space-y-10">
      <div id="privacy-data" className="space-y-6">
        <h1 className="text-2xl font-semibold">How Discord Uses Your Data</h1>

        {items.map(item => (
          <div
            key={item.title}
            className="flex items-start justify-between gap-6">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-default-500 mt-1 text-sm">
                {item.desc}{' '}
                <span className="text-primary cursor-pointer">Learn more</span>
              </p>
            </div>

            <Switch defaultSelected aria-label={item.title}>
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Content>
            </Switch>
          </div>
        ))}
      </div>

      <div className="border-default-100 border-t" />

      <div id="privacy-request" className="space-y-6">
        <h1 className="text-2xl font-semibold">Request Your Data</h1>

        <div>
          <h3 className="font-medium">Request all of my data</h3>
          <p className="text-default-500 text-sm">
            <span className="text-primary cursor-pointer">Learn more</span>{' '}
            about how getting a copy of your personal data works
          </p>
        </div>

        <div className="border-default-200 text-default-500 rounded-xl border p-4 text-sm">
          Your account must be verified with an email address to request data.
          You can verify your account in the My Account section
        </div>

        <button className="bg-primary rounded-lg px-4 py-2 text-white">
          Request Data
        </button>
      </div>
    </div>
  )
}

export { PrivacySettings }
