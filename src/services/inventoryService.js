import { supabase, isSupabaseConfigured } from './supabaseClient';

export const inventoryService = {
  /**
   * Fetch verified blood banks
   */
  async getBloodBanks(city) {
    if (!isSupabaseConfigured) {
      return [
        {
          id: 'bb-1',
          name: 'Red Cross Society National Blood Center',
          address: '1 Red Cross Road, Sansad Marg Area',
          city: 'New Delhi',
          contact_information: '+91 11 2371 6441',
          latitude: 28.6219,
          longitude: 77.2085,
          verification_status: 'verified',
          operating_hours: '24x7'
        },
        {
          id: 'bb-2',
          name: 'AIIMS Apex Regional Blood Bank',
          address: 'Sri Aurobindo Marg, Ansari Nagar East',
          city: 'New Delhi',
          contact_information: '+91 11 2658 8500',
          latitude: 28.5672,
          longitude: 77.2100,
          verification_status: 'verified',
          operating_hours: '24x7'
        },
        {
          id: 'bb-3',
          name: 'Fortis Escorts Heart Institute Blood Bank',
          address: 'Okhla Road, Sukhdev Vihar',
          city: 'New Delhi',
          contact_information: '+91 11 4713 5000',
          latitude: 28.5604,
          longitude: 77.2798,
          verification_status: 'verified',
          operating_hours: '24x7'
        }
      ];
    }

    let query = supabase
      .from('blood_banks')
      .select('*, blood_inventory(*)');

    if (city && city !== 'All Cities') {
      query = query.ilike('city', `%${city}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Fetch inventory items
   */
  async getInventory(bloodBankId) {
    if (!isSupabaseConfigured) {
      return [
        { blood_group: 'O+', component_type: 'Whole Blood', available_units: 42, reserved_units: 4 },
        { blood_group: 'O-', component_type: 'Whole Blood', available_units: 14, reserved_units: 2 },
        { blood_group: 'A+', component_type: 'Whole Blood', available_units: 38, reserved_units: 5 },
        { blood_group: 'B+', component_type: 'Whole Blood', available_units: 45, reserved_units: 6 },
        { blood_group: 'AB+', component_type: 'Whole Blood', available_units: 22, reserved_units: 3 },
        { blood_group: 'O+', component_type: 'Platelets', available_units: 18, reserved_units: 2 }
      ];
    }

    let query = supabase.from('blood_inventory').select('*');
    if (bloodBankId) query = query.eq('blood_bank_id', bloodBankId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Update blood stock units
   */
  async updateUnits(inventoryId, newAvailableUnits) {
    if (!isSupabaseConfigured) return { id: inventoryId, available_units: newAvailableUnits };

    const { data, error } = await supabase
      .from('blood_inventory')
      .update({
        available_units: newAvailableUnits,
        last_updated: new Date().toISOString()
      })
      .eq('id', inventoryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
