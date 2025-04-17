const SUPABASE_URL = 'https://ftcyublpgxarucnsmbjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0Y3l1YmxwZ3hhcnVjbnNtYmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzQ5NzUsImV4cCI6MjA1ODc1MDk3NX0.or6i_6xI6yZ3xO0O7mdbbkIbMdYPWXKCDA52TqQlBds';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  const ownerResults = document.getElementById('owner-results');

  // =============================
  // People Search
  // =============================
  const peopleForm = document.getElementById('people-search-form');

  if (peopleForm) {
    const messageDiv = document.getElementById('message');
    const resultsDiv = document.getElementById('results');

    peopleForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const license = document.getElementById('license').value.trim();

      resultsDiv.innerHTML = '';
      messageDiv.textContent = '';

      if ((name && license) || (!name && !license)) {
        messageDiv.innerHTML = '<p class="error-message" role="alert">Error: Enter either a name OR a license number.</p>';
        return;
      }

      let query = supabaseClient.from('people').select('*');

      if (name) {
        query = query.ilike('Name', `%${name}%`);
      } else {
        query = query.ilike('LicenseNumber', `%${license}%`);
      }

      const { data, error } = await query;

      if (error) {
        messageDiv.innerHTML = '<p class="error-message" role="alert">Error fetching data</p>';
        console.error(error);
        return;
      }

      if (data.length > 0) {
        messageDiv.innerHTML = '<p role="alert">Search successful</p>';
        data.forEach(person => {
          const div = document.createElement('div');
          div.innerHTML = `<p>${person.Name} - ${person.LicenseNumber}</p>`;
          resultsDiv.appendChild(div);
        });
      } else {
        messageDiv.innerHTML = '<p role="alert">No result found</p>';
      }
    });
  }

  // =============================
  // Vehicle Search
  // =============================
  const vehicleForm = document.getElementById('vehicle-search-form');

  if (vehicleForm) {
    const messageDiv = document.getElementById('message');
    const resultsDiv = document.getElementById('results');

    vehicleForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const rego = document.getElementById('rego').value.trim();

      messageDiv.textContent = '';
      resultsDiv.innerHTML = '';

      if (!rego) {
        messageDiv.innerHTML = '<p class="error-message" role="alert">Error: Registration number is required.</p>';
        return;
      }

      const { data: vehicles, error } = await supabaseClient
        .from('vehicles')
        .select('*, people(*)')
        .ilike('VehicleID', `%${rego}%`);

      if (error) {
        messageDiv.innerHTML = '<p class="error-message" role="alert">Error fetching vehicle data.</p>';
        console.error(error);
        return;
      }

      if (vehicles.length === 0) {
        messageDiv.innerHTML = '<p role="alert">No result found</p>';
        return;
      }

      messageDiv.innerHTML = '<p role="alert">Search successful</p>';

      vehicles.forEach(vehicle => {
        const owner = vehicle.people;
        const vehicleInfo = `
          <div class="vehicle-result">
            <p><strong>Vehicle:</strong> ${vehicle.VehicleID} — ${vehicle.Make} ${vehicle.Model} (${vehicle.Colour})</p>
            <p><strong>Owner:</strong> ${owner ? `${owner.Name} — ${owner.LicenseNumber}` : 'Unknown'}</p>
          </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = vehicleInfo;
        resultsDiv.appendChild(div);
      });
    });
  }

  // =============================
  // Add Vehicle - Shared Elements
  // =============================
    let selectedOwnerId = null;
    const checkOwnerBtn = document.getElementById('check-owner');
    const newOwnerBtn = document.getElementById('new-owner');
    const messageOwner = document.getElementById('message-owner');
    const newOwnerForm = document.getElementById('new-owner-form');

    // =============================
    // Add Vehicle - Check Owner
    // =============================
    if (checkOwnerBtn) {
        checkOwnerBtn.addEventListener('click', async () => {
    const ownerName = document.getElementById('owner').value.trim();

    ownerResults.innerHTML = '';
    messageOwner.innerHTML = '';
    newOwnerBtn.style.display = 'none';

    if (!ownerName) {
      messageOwner.innerHTML = '<p class="error-message" role="alert">Please enter an owner name to search.</p>';
      return;
    }

    const { data, error } = await supabaseClient
      .from('people')
      .select('*')
      .ilike('Name', `%${ownerName}%`);

    if (error) {
      messageOwner.innerHTML = '<p class="error-message" role="alert">Error fetching owner data.</p>';
      console.error(error);
      return;
    }

    if (data.length > 0) {
      ownerResults.innerHTML = '<p>Matching owner(s) found:</p>';
      data.forEach(person => {
        const div = document.createElement('div');
    div.innerHTML = `
    <div class="owner-result">
        <p>${person.Name} — ${person.LicenseNumber}</p>
        <button type="button" class="select-owner" data-id="${person.PersonID}" data-name="${person.Name}">Select owner</button>
    </div>
    `;
    ownerResults.appendChild(div);

      });
    } else {
      messageOwner.innerHTML = '<p class="error-message" role="alert">No matching owner found.</p>';
      newOwnerBtn.style.display = 'inline-block';
    }
  });
}

    // =============================
    // Add Vehicle - Select Owner
    // =============================
    if (ownerResults) {
    ownerResults.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('select-owner')) {
        const selectedId = e.target.getAttribute('data-id');
        const selectedName = e.target.getAttribute('data-name');

        selectedOwnerId = selectedId;

        messageOwner.innerHTML =
            `<p role="alert">Owner selected: ${selectedName}</p>`;

        if (newOwnerForm) {
            newOwnerForm.style.display = 'none';
        }
        }
    });
}   


    // =============================
    // Add Vehicle - New Owner Button 
    // =============================
    if (newOwnerBtn) {
        newOwnerBtn.addEventListener('click', () => {
            if (newOwnerForm) {
                newOwnerForm.style.display = 'block';
                messageOwner.innerHTML = '';
                }
            });
    }


    // =============================
    // Add Vehicle - Add Owner Button
    // =============================
    const addOwnerBtn = document.getElementById('add-owner');

    if (addOwnerBtn) {
    addOwnerBtn.addEventListener('click', async () => {
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const dob = document.getElementById('dob').value;
        const license = document.getElementById('license').value.trim();
        const expire = document.getElementById('expire').value;
        const messageOwner = document.getElementById('message-owner');
        const newOwnerForm = document.getElementById('new-owner-form');

        messageOwner.innerHTML = '';

        if (!name || !address || !dob || !license || !expire) {
        messageOwner.innerHTML = '<p class="error-message" role="alert">Error: All fields are required.</p>';
        return;
        }

        console.log('Attempting to add owner:', { name, address, dob, license, expire });

        try {
        const { data: existing, error: searchError } = await supabaseClient
            .from('people')
            .select('*')
            .eq('Name', name)
            .eq('Address', address)
            .eq('DOB', dob)
            .eq('LicenseNumber', license)
            .eq('ExpiryDate', expire);

        if (searchError) {
            messageOwner.innerHTML = '<p class="error-message" role="alert">Error checking for duplicate owner.</p>';
            console.error(searchError);
            return;
        }

        if (existing.length > 0) {
            messageOwner.innerHTML = '<p class="error-message" role="alert">Error: This owner already exists.</p>';
            return;
        }

        const { data: inserted, error: insertError } = await supabaseClient
            .from('people')
            .insert([
            {
                Name: name,
                Address: address,
                DOB: dob,
                LicenseNumber: license,
                ExpiryDate: expire
            }
            ])
            .select();

        if (insertError || !inserted || inserted.length === 0) {
            messageOwner.innerHTML = '<p class="error-message" role="alert">Error: Could not add owner.</p>';
            console.error(insertError);
            return;
        }

        const newOwner = inserted[0];
        selectedOwnerId = newOwner.PersonID;

        messageOwner.innerHTML = `<p role="alert">✅ Owner added successfully: ${newOwner.Name}</p>`;
        if (newOwnerForm) newOwnerForm.style.display = 'none';

        } catch (e) {
        console.error('Unexpected error:', e);
        messageOwner.innerHTML = '<p class="error-message" role="alert">Unexpected error occurred.</p>';
        }
        });
    }

    // =============================
    // Add Vehicle - Add Vehicle Button
    // =============================
    const addVehicleBtn = document.getElementById('add-vehicle');

        if (addVehicleBtn) {
        addVehicleBtn.addEventListener('click', async () => {
            const rego = document.getElementById('rego').value.trim();
            const make = document.getElementById('make').value.trim();
            const model = document.getElementById('model').value.trim();
            const colour = document.getElementById('colour').value.trim();
            const messageVehicle = document.getElementById('message-vehicle');

            messageVehicle.innerHTML = '';

            // Validation
            if (!rego || !make || !model || !colour) {
            messageVehicle.innerHTML = '<p class="error-message" role="alert">Error: Please fill in all vehicle fields.</p>';
            return;
            }

            if (!selectedOwnerId) {
            messageVehicle.innerHTML = '<p class="error-message" role="alert">Error: Please select or add an owner first.</p>';
            return;
            }

            // Check for existing vehicle
            const { data: existing, error: checkError } = await supabaseClient
            .from('vehicles')
            .select('*')
            .eq('VehicleID', rego);

            if (checkError) {
            messageVehicle.innerHTML = '<p class="error-message" role="alert">Error checking existing vehicles.</p>';
            console.error(checkError);
            return;
            }

            if (existing.length > 0) {
            messageVehicle.innerHTML = '<p class="error-message" role="alert">Error: A vehicle with this registration already exists.</p>';
            return;
            }

            // Insert vehicle
            const { error: insertError } = await supabaseClient
            .from('vehicles')
            .insert([
                {
                VehicleID: rego,
                Make: make,
                Model: model,
                Colour: colour,
                OwnerID: selectedOwnerId
                }
            ]);

            if (insertError) {
            messageVehicle.innerHTML = '<p class="error-message" role="alert">Error adding vehicle to database.</p>';
            console.error(insertError);
            return;
            }

            messageVehicle.innerHTML = `<p role="alert">Vehicle added successfully!</p>`;
        });
    }

        




});
