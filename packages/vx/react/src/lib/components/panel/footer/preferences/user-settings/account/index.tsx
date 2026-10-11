import { CustomTabs } from '../../../tabs'

const AccountSettings = () => {
  const tabs = [
    {
      id: 'security',
      label: 'Security',
      content: <p>View your project overview and recent activity.</p>
    },
    {
      id: 'standing',
      label: 'Standing',
      content: <p>Track your metrics and analyze performance data.</p>
    }
  ]
  return (
    <div>
      <CustomTabs tabs={tabs} />
    </div>
  )
}

export { AccountSettings }
