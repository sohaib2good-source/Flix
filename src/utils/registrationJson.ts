import type { RegistrationPackage } from '../pages/RegistrationConfig';

export interface RegistrationFormData {
  contactType: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  postCode: string;
  town: string;
  country: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  placeOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportIssuingCountry: string;
  differentDelivery: string;
  deliveryAddress: string;
  deliveryPostCode: string;
  deliveryTown: string;
  deliveryCountry: string;

  hasOwner2: boolean;
  owner2FirstName: string;
  owner2LastName: string;
  owner2Address: string;
  owner2PostCode: string;
  owner2Town: string;
  owner2Country: string;
  owner2Email: string;
  owner2Phone: string;
  owner2Mobile: string;
  owner2DobDay: string;
  owner2DobMonth: string;
  owner2DobYear: string;
  owner2PlaceOfBirth: string;
  owner2PassportNumber: string;

  operatorFirstName: string;
  operatorLastName: string;

  boatName: string;
  maxPassengers: string;
  boatLength: string;
  portOfChoice: string;
  boatCategory: string;
  comments: string;
}

export interface StandardRegistrationJson {
  id?: string;
  applicationId?: string;
  createdAt: string;
  entity: {
    type: 'private' | 'company';
    companyName?: string;
    primaryOwner: {
      details: {
        firstName: string;
        lastName: string;
        companyName?: string;
        email: string;
        phone: string;
        mobile?: string;
        nationality: string;
        address: string;
        postCode: string;
        town: string;
        country: string;
        birth: {
          day: string;
          month: string;
          year: string;
          place: string;
        };
        identity: {
          nationality: string;
          passportNumber: string;
          issuingCountry: string;
        };
        differentDelivery: 'yes' | 'no';
        deliveryAddress?: string;
        deliveryPostCode?: string;
        deliveryTown?: string;
        deliveryCountry?: string;
      };
    };
    secondaryOwner?: {
      enabled: boolean;
      details?: {
        firstName: string;
        lastName: string;
        address: string;
        postCode: string;
        town: string;
        country: string;
        email: string;
        phone: string;
        mobile?: string;
        birth: {
          day: string;
          month: string;
          year: string;
          place: string;
        };
        identity: {
          passportNumber: string;
        };
      } | null;
    };
    operator?: {
      firstName: string;
      lastName: string;
    };
  };
  registration: {
    serviceId: string;
    vessel: {
      name: string;
      length: string;
      maxPassengers: string;
      portOfChoice: string;
      category: string;
      comments: string;
    };
    engines: any[];
  };
  package: {
    vesselClass: string;
    serviceType: string;
    usageIntent: string;
    mmsiConfig: string;
    speed: string;
    shippingMethod: string;
    totalPrice: number;
  };
  financial: {
    total: string;
    currency: string;
    status: string;
  };
  system: {
    status: string;
    paymentStatus: string;
    serverTimestamp: string;
    adminComments: string;
    source: string;
  };
  history: Array<{
    timestamp: string;
    changes: string;
  }>;
}

/**
 * Builds a comprehensive, standardized JSON structure from step 1 & step 2 data.
 * This JSON is used in the background for database persistence, API sync, and future integrations.
 */
export function buildRegistrationJson(
  pkg: RegistrationPackage | null,
  form: RegistrationFormData
): StandardRegistrationJson {
  const now = new Date().toISOString();
  const totalPrice = pkg?.totalPrice ?? 350;

  return {
    createdAt: now,
    entity: {
      type: (form.contactType === 'company' ? 'company' : 'private') as 'private' | 'company',
      companyName: form.contactType === 'company' ? form.companyName : '',
      primaryOwner: {
        details: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          companyName: form.contactType === 'company' ? form.companyName.trim() : '',
          email: form.email.trim(),
          phone: form.phone.trim(),
          mobile: form.mobile.trim(),
          nationality: form.nationality.trim(),
          address: form.address.trim(),
          postCode: form.postCode.trim(),
          town: form.town.trim(),
          country: form.country.trim(),
          birth: {
            day: form.dobDay.trim(),
            month: form.dobMonth.trim(),
            year: form.dobYear.trim(),
            place: form.placeOfBirth.trim()
          },
          identity: {
            nationality: form.nationality.trim(),
            passportNumber: form.passportNumber.trim(),
            issuingCountry: form.passportIssuingCountry.trim()
          },
          differentDelivery: (form.differentDelivery === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
          deliveryAddress: form.differentDelivery === 'yes' ? form.deliveryAddress.trim() : '',
          deliveryPostCode: form.differentDelivery === 'yes' ? form.deliveryPostCode.trim() : '',
          deliveryTown: form.differentDelivery === 'yes' ? form.deliveryTown.trim() : '',
          deliveryCountry: form.differentDelivery === 'yes' ? form.deliveryCountry.trim() : ''
        }
      },
      secondaryOwner: {
        enabled: !!form.hasOwner2,
        details: form.hasOwner2 ? {
          firstName: form.owner2FirstName.trim(),
          lastName: form.owner2LastName.trim(),
          address: form.owner2Address.trim(),
          postCode: form.owner2PostCode.trim(),
          town: form.owner2Town.trim(),
          country: form.owner2Country.trim(),
          email: form.owner2Email.trim(),
          phone: form.owner2Phone.trim(),
          mobile: form.owner2Mobile.trim(),
          birth: {
            day: form.owner2DobDay.trim(),
            month: form.owner2DobMonth.trim(),
            year: form.owner2DobYear.trim(),
            place: form.owner2PlaceOfBirth.trim()
          },
          identity: {
            passportNumber: form.owner2PassportNumber.trim()
          }
        } : null
      },
      operator: {
        firstName: form.operatorFirstName.trim(),
        lastName: form.operatorLastName.trim()
      }
    },
    registration: {
      serviceId: pkg?.serviceType || 'polish_flag_registry',
      vessel: {
        name: form.boatName.trim(),
        length: form.boatLength.trim(),
        maxPassengers: form.maxPassengers.trim(),
        portOfChoice: form.portOfChoice || 'GDANSK',
        category: form.boatCategory || 'none',
        comments: form.comments.trim()
      },
      engines: []
    },
    package: {
      vesselClass: pkg?.vesselClass || '0_to_7',
      serviceType: pkg?.serviceType || 'new_flag',
      usageIntent: pkg?.usageIntent || 'private',
      mmsiConfig: pkg?.mmsiConfig || 'none',
      speed: pkg?.speed || 'standard',
      shippingMethod: pkg?.shippingMethod || 'standard',
      totalPrice
    },
    financial: {
      total: totalPrice.toFixed(2),
      currency: 'EUR',
      status: 'pending'
    },
    system: {
      status: 'DOCUMENTATION_SUBMITTED',
      paymentStatus: 'WAITING_PAYMENT_LINK',
      serverTimestamp: now,
      adminComments: '',
      source: 'web_application'
    },
    history: [
      {
        timestamp: now,
        changes: 'Initial digital documentation submitted online with background JSON structure'
      }
    ]
  };
}
