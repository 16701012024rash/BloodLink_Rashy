// BloodLink Mock Data Store

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPATIBILITY = {
  'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
  'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }, // Universal Recipient
  'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'] },
  'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O+', 'O-'] },
  'O-': { canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'] } // Universal Donor
};

export const CITIES = [
  'All Cities',
  'New Delhi',
  'Delhi NCR',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh'
];

export const INITIAL_DONORS = [
  {
    id: 'donor-1',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    city: 'New Delhi',
    state: 'Delhi',
    age: 28,
    isAvailable: true,
    lastDonated: '12 Oct 2026',
    totalDonations: 4,
    livesImpacted: 12,
    rating: 4.9,
    isVerified: true,
    badges: ['Life Saver', 'Regular Donor'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    bio: 'Regular blood donor since 2024. Happy to help in emergencies across Delhi NCR.'
  },
  {
    id: 'donor-2',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    phone: '+91 98123 45678',
    bloodGroup: 'A+',
    city: 'New Delhi',
    state: 'Delhi',
    age: 26,
    isAvailable: true,
    lastDonated: '15 Aug 2026',
    totalDonations: 6,
    livesImpacted: 18,
    rating: 5.0,
    isVerified: true,
    badges: ['Life Saver', 'Golden Drop'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bio: 'Healthcare professional & passionate volunteer. Ready for emergency calls.'
  },
  {
    id: 'donor-3',
    name: 'Dr. Rajesh Verma',
    email: 'dr.verma@example.com',
    phone: '+91 99887 66554',
    bloodGroup: 'B+',
    city: 'Mumbai',
    state: 'Maharashtra',
    age: 34,
    isAvailable: true,
    lastDonated: '01 Jul 2026',
    totalDonations: 12,
    livesImpacted: 36,
    rating: 5.0,
    isVerified: true,
    badges: ['Life Saver', 'Regular Donor', 'Champion'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    bio: 'Resident doctor. Blood donation is the simplest way to save a human life.'
  },
  {
    id: 'donor-4',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 97110 33442',
    bloodGroup: 'O-',
    city: 'New Delhi',
    state: 'Delhi',
    age: 31,
    isAvailable: true,
    isUniversalDonor: true,
    lastDonated: '05 Jan 2026',
    totalDonations: 8,
    livesImpacted: 24,
    rating: 4.9,
    isVerified: true,
    badges: ['Universal Hero', 'Life Saver'],
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200',
    bio: 'O- Universal donor. Always available on standby for neonatal and critical cases.'
  },
  {
    id: 'donor-5',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    phone: '+91 98450 12399',
    bloodGroup: 'AB+',
    city: 'Bangalore',
    state: 'Karnataka',
    age: 24,
    isAvailable: true,
    lastDonated: '20 Sep 2026',
    totalDonations: 3,
    livesImpacted: 9,
    rating: 4.8,
    isVerified: true,
    badges: ['Regular Donor'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: 'Software engineer in Whitefield. Available for emergency plasma and whole blood.'
  },
  {
    id: 'donor-6',
    name: 'Rohit Mehta',
    email: 'rohit.m@example.com',
    phone: '+91 98300 77112',
    bloodGroup: 'B-',
    city: 'Kolkata',
    state: 'West Bengal',
    age: 29,
    isAvailable: true,
    lastDonated: '14 Jun 2026',
    totalDonations: 5,
    livesImpacted: 15,
    rating: 4.9,
    isVerified: true,
    badges: ['Life Saver'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'Rare blood group volunteer. Ping me anytime for urgent requests.'
  },
  {
    id: 'donor-7',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 94440 88221',
    bloodGroup: 'A-',
    city: 'Chennai',
    state: 'Tamil Nadu',
    age: 27,
    isAvailable: false, // Recently donated
    lastDonated: '10 Nov 2026',
    totalDonations: 2,
    livesImpacted: 6,
    rating: 4.7,
    isVerified: true,
    badges: ['Regular Donor'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Next eligible in February 2027. Proud BloodLink donor.'
  },
  {
    id: 'donor-8',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@example.com',
    phone: '+91 99499 55443',
    bloodGroup: 'AB-',
    city: 'Hyderabad',
    state: 'Telangana',
    age: 30,
    isAvailable: true,
    lastDonated: '22 Feb 2026',
    totalDonations: 4,
    livesImpacted: 12,
    rating: 4.9,
    isVerified: true,
    badges: ['Life Saver'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    bio: 'AB- blood group advocate. Always ready to step up when needed.'
  },
  {
    id: 'donor-9',
    name: 'Karan Malhotra',
    email: 'karan.m@example.com',
    phone: '+91 98220 99881',
    bloodGroup: 'O+',
    city: 'Pune',
    state: 'Maharashtra',
    age: 32,
    isAvailable: true,
    lastDonated: '18 May 2026',
    totalDonations: 7,
    livesImpacted: 21,
    rating: 4.8,
    isVerified: true,
    badges: ['Life Saver', 'Regular Donor'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bio: 'Fitness enthusiast & marathon runner. Happy to donate anytime.'
  },
  {
    id: 'donor-10',
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    phone: '+91 98795 11223',
    bloodGroup: 'B+',
    city: 'Ahmedabad',
    state: 'Gujarat',
    age: 25,
    isAvailable: true,
    lastDonated: '30 Mar 2026',
    totalDonations: 3,
    livesImpacted: 9,
    rating: 4.7,
    isVerified: true,
    badges: ['Regular Donor'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    bio: 'Community volunteer and educator. Let’s make blood shortages history!'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'REQ-2026-881',
    patientName: 'Maria Rodriguez',
    requesterName: 'Maria Rodriguez',
    requesterEmail: 'maria@example.com',
    bloodGroup: 'A+',
    unitsRequired: 2,
    unitsFulfilled: 1,
    hospitalName: 'City Hospital',
    city: 'New Delhi',
    hospitalAddress: 'Sector 14, Ring Road, New Delhi',
    roomNumber: 'ICU Ward 302',
    contactNumber: '+91 98760 11223',
    priority: 'High', // Critical, High, Medium, Normal
    status: 'In Progress - Donor Found', // Pending, In Progress - Donor Found, Fulfilled, Cancelled
    requiredDate: '22 Nov 2026',
    createdAt: '12 Oct 2026',
    notes: 'Urgent surgery scheduled. Need 2 units of A+ blood. Donor found, preparing for cross-matching.',
    matchedDonor: {
      name: 'Amit Kumar',
      bloodGroup: 'O+',
      phone: '+91 98765 43210',
      status: 'Confirmed'
    },
    progressPercent: 75
  },
  {
    id: 'REQ-2026-904',
    patientName: 'Rajesh Khanna',
    requesterName: 'Sunil Khanna (Son)',
    requesterEmail: 'sunil.k@example.com',
    bloodGroup: 'O-',
    unitsRequired: 3,
    unitsFulfilled: 0,
    hospitalName: 'AIIMS New Delhi',
    city: 'New Delhi',
    hospitalAddress: 'Ansari Nagar, New Delhi',
    roomNumber: 'Emergency Trauma Bed 7',
    contactNumber: '+91 98111 22334',
    priority: 'Critical',
    status: 'Pending',
    requiredDate: 'Immediate',
    createdAt: '21 Nov 2026',
    notes: 'Emergency polytrauma case following highway accident. Universal donor urgently needed.',
    matchedDonor: null,
    progressPercent: 20
  },
  {
    id: 'REQ-2026-752',
    patientName: 'Deepak Roy',
    requesterName: 'Anil Roy',
    requesterEmail: 'anil.roy@example.com',
    bloodGroup: 'B+',
    unitsRequired: 1,
    unitsFulfilled: 1,
    hospitalName: 'Apollo Hospital',
    city: 'Mumbai',
    hospitalAddress: 'CBD Belapur, Navi Mumbai',
    roomNumber: 'Cardiology 4th Floor',
    contactNumber: '+91 98221 44556',
    priority: 'High',
    status: 'In Progress - Donor Found',
    requiredDate: '23 Nov 2026',
    createdAt: '20 Nov 2026',
    notes: 'Bypass procedure on Monday morning. One replacement unit required.',
    matchedDonor: {
      name: 'Dr. Rajesh Verma',
      bloodGroup: 'B+',
      phone: '+91 99887 66554',
      status: 'On the way'
    },
    progressPercent: 80
  },
  {
    id: 'REQ-2026-610',
    patientName: 'Kavita Singh',
    requesterName: 'Maria Rodriguez',
    requesterEmail: 'maria@example.com',
    bloodGroup: 'A+',
    unitsRequired: 2,
    unitsFulfilled: 2,
    hospitalName: 'City Hospital',
    city: 'New Delhi',
    hospitalAddress: 'Sector 14, New Delhi',
    roomNumber: 'Ward 104',
    contactNumber: '+91 98760 11223',
    priority: 'Medium',
    status: 'Completed',
    requiredDate: '12 Oct 2026',
    createdAt: '10 Oct 2026',
    notes: 'Successfully fulfilled with thanks to the BloodLink donor community.',
    matchedDonor: {
      name: 'Priya Sharma',
      bloodGroup: 'A+',
      phone: '+91 98123 45678',
      status: 'Completed'
    },
    progressPercent: 100
  },
  {
    id: 'REQ-2026-520',
    patientName: 'Maria Rodriguez',
    requesterName: 'Maria Rodriguez',
    requesterEmail: 'maria@example.com',
    bloodGroup: 'A+',
    unitsRequired: 1,
    unitsFulfilled: 1,
    hospitalName: "St. Mary's Hospital",
    city: 'New Delhi',
    hospitalAddress: 'Civil Lines, Delhi',
    roomNumber: 'Daycare Transfusion Wing',
    contactNumber: '+91 98760 11223',
    priority: 'Normal',
    status: 'Completed',
    requiredDate: '15 Sep 2026',
    createdAt: '13 Sep 2026',
    notes: 'Routine scheduled thalassemia transfusion.',
    matchedDonor: {
      name: 'Amit Kumar',
      bloodGroup: 'O+',
      phone: '+91 98765 43210',
      status: 'Completed'
    },
    progressPercent: 100
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'emergency', // emergency, match, update, reminder
    title: 'Critical Emergency: O- Blood Needed!',
    message: 'AIIMS New Delhi urgently needs 3 units of O- blood for trauma surgery.',
    timestamp: '10 minutes ago',
    read: false,
    urgent: true,
    actionUrl: '/requests'
  },
  {
    id: 'notif-2',
    type: 'match',
    title: 'Incoming Blood Request Match',
    message: 'City Hospital has requested 2 units of A+/O+ blood in your vicinity.',
    timestamp: '1 hour ago',
    read: false,
    urgent: false,
    actionUrl: '/donor-dashboard'
  },
  {
    id: 'notif-3',
    type: 'update',
    title: 'Donation Appointment Confirmed',
    message: 'Your donation appointment at Red Cross Delhi is confirmed for 25 Nov 2026 at 10:00 AM.',
    timestamp: 'Yesterday',
    read: true,
    urgent: false,
    actionUrl: '/donor-dashboard'
  },
  {
    id: 'notif-4',
    type: 'reminder',
    title: 'Life Impact Update: You Saved 3 Lives',
    message: 'Blood unit from your 12 Oct donation was successfully transfused to a patient in critical care.',
    timestamp: '3 days ago',
    read: true,
    urgent: false,
    actionUrl: '/donor-dashboard'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "BloodLink helped me find a donor for my father within 6 hours. Grateful for such a life-saving platform!",
    author: "Priya Sharma",
    location: "Delhi",
    role: "Family Requester",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 2,
    quote: "As a rare AB- blood donor, this app alerts me only when someone genuinely needs my specific blood type. Zero spam, pure impact.",
    author: "Sunita Reddy",
    location: "Hyderabad",
    role: "Verified Donor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 3,
    quote: "Our emergency trauma center coordinates with BloodLink donors daily. The response speed is remarkable during critical golden hours.",
    author: "Dr. A. Khan",
    location: "New Delhi",
    role: "Chief Medical Officer",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
  }
];

export const BLOOD_GROUP_STATS = [
  { group: 'O+', availability: 'Good', percentage: 78, donors: 18450, need: 'Moderate' },
  { group: 'A+', availability: 'Good', percentage: 72, donors: 14200, need: 'Moderate' },
  { group: 'B+', availability: 'Good', percentage: 65, donors: 12800, need: 'Moderate' },
  { group: 'AB+', availability: 'Adequate', percentage: 55, donors: 4300, need: 'Low' },
  { group: 'O-', availability: 'Critical', percentage: 22, donors: 1950, need: 'Urgent' },
  { group: 'A-', availability: 'Low', percentage: 34, donors: 1100, need: 'High' },
  { group: 'B-', availability: 'Low', percentage: 30, donors: 950, need: 'High' },
  { group: 'AB-', availability: 'Critical', percentage: 18, donors: 480, need: 'Urgent' },
];
