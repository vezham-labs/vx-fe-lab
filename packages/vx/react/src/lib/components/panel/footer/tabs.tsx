import React from 'react'

import { Tabs } from '@vezham/react-v3'

interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

interface Props {
  tabs: TabItem[]
}

const CustomTabs = ({ tabs }: Props) => {
  return (
    <Tabs className="w-full" variant="secondary">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Options">
          {tabs.map(tab => (
            <Tabs.Tab key={tab.id} id={tab.id}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {tabs.map(tab => (
        <Tabs.Panel key={tab.id} className="pt-4" id={tab.id}>
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}

export { CustomTabs }
