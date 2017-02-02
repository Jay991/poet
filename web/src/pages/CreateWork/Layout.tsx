import * as React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import { StepRegister, StepRegisterData } from './StepRegister/StepRegister'
import { StepLicense, StepLicenseData } from './StepLicense/StepLicense'
import StepPublishAndReview from './StepPublishAndReview/StepPublishAndReview'

import './Layout.scss'

interface CreateWorkProps {
  readonly createWorkRequested: (claims: any[]) => any // Actions.claimsSubmitRequested
  readonly userName?: string;
  readonly userPublicKey: string;
}

interface CreateWorkLayoutState {
  readonly selectedStep: number;
  readonly licenseData?: StepLicenseData;
  readonly workData?: StepRegisterData;
  readonly workTitle?: string;
}

export default class CreateWorkLayout extends React.Component<CreateWorkProps, CreateWorkLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedStep: 0,
    }
  }

  render() {
    return (
      <section className="create-work">
        <Tabs selectedIndex={this.state.selectedStep}>
          <TabList className="tab-list">
            <Tab>Register</Tab>
            <Tab>License</Tab>
            <Tab>Review &amp; Publish</Tab>
          </TabList>
          <TabPanel>
            <StepRegister onSubmit={this.onStepRegisterSubmit.bind(this)} />
          </TabPanel>
          <TabPanel>
            <StepLicense onSubmit={this.onStepLicenseSubmit.bind(this)} />
          </TabPanel>
          <TabPanel>
            <StepPublishAndReview
              workTitle={this.state.workTitle}
              price={this.state.licenseData && this.state.licenseData.pricing.price}
              onSubmit={this.submitWork.bind(this)}
              licenseType={this.state.licenseData && this.state.licenseData.licenseType}
            />
          </TabPanel>
        </Tabs>
      </section>

    )
  }

  private onStepRegisterSubmit(workData: StepRegisterData) {
    console.log('onStepRegisterSubmit', workData);

    const workTitleAttribute = workData.attributes.find(attribute => attribute.key == 'title');

    this.setState({
      selectedStep: 1,
      workData,
      workTitle: workTitleAttribute && workTitleAttribute.value
    })
  }

  private onStepLicenseSubmit(licenseData: StepLicenseData) {
    console.log('onStepLicenseSubmit', licenseData);
    this.setState({
      selectedStep: 2,
      licenseData: licenseData
    })
  }

  private submitWork() {
    this.props.createWorkRequested([
      {
        type: 'Work',
        attributes: [
          ...this.state.workData.attributes,
          { key: 'articleType', value: this.state.workData.articleType },
          { key: 'content', value: this.state.workData.content },
          { key: 'authorPublicKey', value: this.props.userPublicKey }
        ]
      },
      {
        type: 'Offering',
        attributes: {
          'licenseType': this.state.licenseData.licenseType.name,
          'licenseDescription': this.state.licenseData.licenseType.description,
          'pricingFrequency': this.state.licenseData.pricing.frequency,
          'pricingPriceAmount': this.state.licenseData.pricing.price.amount,
          'pricingPriceCurrency': this.state.licenseData.pricing.price.currency
        }
      }
    ])
  }
}
