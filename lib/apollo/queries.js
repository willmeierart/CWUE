import gql from 'graphql-tag'

const allEndpoints = ['_Carwash_USA_Express', '_Cloned_CWUE']
const hitEndpoints = (endpoints, qName, query) => { // this func allows for a query formatted for merging via the proxy api
  const queryIterator = endpoints.map(epa => `${epa}{${query}}`).join('')
  return gql`query ${qName}{${queryIterator}}`
}

// HOMEPAGE / GENERAL:
export const pageCopy = gql`
  query pageCopy {
    allPageCopies (first: 1) {
      homePageCopy
      locationsPageCopy
      aboutPageCopy
    }
  }
`

export const homePage = gql`
  query homePage {
    allHomepages(first: 1) {
      headerImage {
        url
      }
      specials {
        title
        description
        icon {
          url
        }
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
    }
    allPageCopies (first: 1) {
      homePageCopy
    }
  }
`

export const allLocations = hitEndpoints(allEndpoints,
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
      pricePackage
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
  }
  allPageCopies (first: 1) {
    locationsPageCopy
  }`
)

// ABOUT PAGE
export const aboutPage = gql`
  query aboutPage {
    allAboutPages (first: 1) {
      aboutPageSections {
        section
        headerText
        subheaderText
      }
      contactInfo {
        phone
        email
        address
      }
      fAQs {
        question
        answer
      }
      blogPosts {
        date
        createdAt
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
      testimonialEmail
      mailingListBlurb
      fundraisingFlyer {
        url
      }
    }
    allPageCopies (first: 1) {
      aboutPageCopy
    }
  }
`

// WASHES PAGE
export const allWashes = gql`
  query allWashes {
    allWashes {
      washType
      washTitle
      description
      priceSingle
      pricePackage
      washFeatures {
        name
        description
        icon {
          url
        }
      }
    }
  }
`

// FASTPASS PAGE
export const fastPass = gql`
  query fastPass {
    allFastPassInfoes (first: 1) {
      description
      calloutImage {
        url
      }
    }
  }
`
