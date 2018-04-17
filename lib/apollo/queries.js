import gql from 'graphql-tag'

const allEndpoints = ['_Carwash_USA_Express', '_Cloned_CWUE']
const thisEndpoint = ['_Carwash_USA_Express']
const hitEndpoints = (endpoints, qName, query) => {
  const queryIterator = endpoints.map(epa => `${epa}{${query}}`).join('')
  return gql`query ${qName}{${queryIterator}}`
}

// HOMEPAGE / GENERAL:
export const homePage = hitEndpoints(
  thisEndpoint,
  'homePage',
  `allHomepages(first: 1) {
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
    brandInfo {
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
  }`
)

export const allLocations = hitEndpoints(
  allEndpoints,
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
export const aboutPage = hitEndpoints(
  thisEndpoint,
  'aboutPage',
  `allAboutPages(first: 1) {
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
  }`
)
