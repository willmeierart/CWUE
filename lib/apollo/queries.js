import gql from 'graphql-tag'

const endpointAliases = ['_Carwash_USA_Express', '_Cloned_CWUE']
const hitAllEndpoints = (endpoints, qName, query) => {
  const queryIterator = endpoints.map(epa => `${epa}{${query}}`).join('')
  return gql`query ${qName}{${queryIterator}}`
}

// HOMEPAGE / GENERAL:
export const HomePage = gql`
  query homePage {
    allHomepages(first: 1) {
      headerImage {
        url
      }
      aboutBlurb
      specials {
        description
      }
      testimonials {
        name
        blurb
      }
      fastPassInfo {
        description
        calloutImage {
          url
        }
      }
    }
  }
`
export const brandInfo = gql`
  query brandInfo {
    allBrandInfoes(first: 1) {
      brandName
      companyLogo {
        url
      }
      domainName
      contactInfo {
        phone
        email
        address
      }
      giftCardPrices
    }
  }
`
export const brandInfoMinimal = gql`
  query brandInfoMinimal {
    allBrandInfoes(first: 1) {
      brandName
      companyLogo {
        url
      }
      domainName
    }
  }
`
export const otherSites = gql`
  query otherSites {
    allOtherSites {
      graphCMSEndpoint
    }
  }
`

export const allLocations = hitAllEndpoints(
  endpointAliases,
  'allLocations',
  `allLocations {
    name
    addressStreet
    addressCity
    addressState
    addressZip
    coordinates,
    openHours {
      days
      time
    }
    images {
      url
    }
    description
    phone
    specials {
      description
    }
    washes {
      washType
      priceSingle
      priceMultiple
      washFeatures {
        name
        description
        icon {
          url
        }
      }
    }
    sEOLocationCategories {
      filterType
      name
    }
    giftCards
    onlineOrderingAvailable
    fastPass
  }`
)

// ABOUT PAGE
export const aboutPage = gql`
  query aboutPage {
    allAboutPages(first: 1) {
      company
      fAQs {
        question
        answer
      }
      blogPosts {
        date
        title
        image {
          url
        }
        body
      }
      testimonials {
        name
        blurb
      }
      feedback
      fundraising
      mailingList
      generalInquiries
      careers
    }
  }
`
