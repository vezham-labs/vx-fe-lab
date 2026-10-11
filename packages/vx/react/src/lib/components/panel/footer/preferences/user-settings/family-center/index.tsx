import { CustomTabs } from '../../../tabs'

const FamilyCenterSettings = () => {
  const tabs = [
    {
      id: 'activity',
      label: 'Activity',
      content: <p>View your project overview and recent activity.</p>
    },
    {
      id: 'family',
      label: 'My Family',
      content: <p>Track your metrics and analyze performance data.</p>
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <p>Track your metrics and analyze performance settings data.</p>
    }
  ]

  return (
    <div>
      <CustomTabs tabs={tabs} />
    </div>
  )
}

export { FamilyCenterSettings }
