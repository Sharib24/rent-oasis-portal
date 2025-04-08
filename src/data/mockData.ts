
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'landlord' | 'tenant';
  profileImage?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  units: number;
  imageUrl: string;
  landlordId: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rentAmount: number;
  isOccupied: boolean;
  tenantId?: string;
}

export interface RentPayment {
  id: string;
  unitId: string;
  tenantId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Mock Users
export const users: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    role: "landlord",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "tenant",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "landlord",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily@example.com",
    role: "tenant",
    profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
  }
];

// Mock Properties
export const properties: Property[] = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "123 Main St",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    units: 12,
    imageUrl: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    landlordId: "1"
  },
  {
    id: "2",
    name: "Ocean View Condos",
    address: "456 Beach Rd",
    city: "San Diego",
    state: "CA",
    zip: "92101",
    units: 8,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    landlordId: "1"
  },
  {
    id: "3",
    name: "Mountain Terrace",
    address: "789 Highland Dr",
    city: "Denver",
    state: "CO",
    zip: "80202",
    units: 6,
    imageUrl: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    landlordId: "3"
  },
  {
    id: "4",
    name: "Urban Lofts",
    address: "101 Downtown Ave",
    city: "New York",
    state: "NY",
    zip: "10001",
    units: 20,
    imageUrl: "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    landlordId: "3"
  }
];

// Mock Units
export const units: Unit[] = [
  {
    id: "1",
    propertyId: "1",
    unitNumber: "101",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 900,
    rentAmount: 1500,
    isOccupied: true,
    tenantId: "2"
  },
  {
    id: "2",
    propertyId: "1",
    unitNumber: "102",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 950,
    rentAmount: 1600,
    isOccupied: true,
    tenantId: "4"
  },
  {
    id: "3",
    propertyId: "2",
    unitNumber: "201",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    rentAmount: 2200,
    isOccupied: true,
    tenantId: "2"
  },
  {
    id: "4",
    propertyId: "3",
    unitNumber: "301",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 700,
    rentAmount: 1100,
    isOccupied: false
  }
];

// Mock Rent Payments
export const rentPayments: RentPayment[] = [
  {
    id: "1",
    unitId: "1",
    tenantId: "2",
    amount: 1500,
    dueDate: "2025-04-01",
    paidDate: "2025-03-29",
    status: "paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "2",
    unitId: "1",
    tenantId: "2",
    amount: 1500,
    dueDate: "2025-05-01",
    status: "pending"
  },
  {
    id: "3",
    unitId: "2",
    tenantId: "4",
    amount: 1600,
    dueDate: "2025-04-01",
    status: "overdue"
  },
  {
    id: "4",
    unitId: "3",
    tenantId: "2",
    amount: 2200,
    dueDate: "2025-04-01",
    paidDate: "2025-04-01",
    status: "paid",
    paymentMethod: "Bank Transfer"
  }
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    message: "New tenant application for Sunset Apartments",
    type: "info",
    isRead: false,
    createdAt: "2025-04-07T14:30:00Z"
  },
  {
    id: "2",
    userId: "2",
    message: "Your rent payment was received",
    type: "success",
    isRead: true,
    createdAt: "2025-04-06T10:15:00Z"
  },
  {
    id: "3",
    userId: "2",
    message: "Rent due in 5 days",
    type: "warning",
    isRead: false,
    createdAt: "2025-04-08T09:00:00Z"
  },
  {
    id: "4",
    userId: "3",
    message: "Maintenance request submitted for unit 301",
    type: "info",
    isRead: false,
    createdAt: "2025-04-07T16:45:00Z"
  }
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getPropertiesByLandlord = (landlordId: string): Property[] => {
  return properties.filter(property => property.landlordId === landlordId);
};

export const getUnitsByProperty = (propertyId: string): Unit[] => {
  return units.filter(unit => unit.propertyId === propertyId);
};

export const getUnitsByTenant = (tenantId: string): Unit[] => {
  return units.filter(unit => unit.tenantId === tenantId);
};

export const getRentPaymentsByTenant = (tenantId: string): RentPayment[] => {
  return rentPayments.filter(payment => payment.tenantId === tenantId);
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return notifications.filter(notification => notification.userId === userId);
};
