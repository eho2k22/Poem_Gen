// process custom parameters 
function getQueryStringParams(query) {
    // Takes a query string and converts it to an object with key-value pairs
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
          .split('&')
          .reduce((params, param) => {
              let [key, value] = param.split('=');
              params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
              return params;
          }, {}
      )
      : {};
    }

// Fetch the config from the server
function fetchConfig() {
    return fetch('/config')
      .then(response => response.json())
      .then(config => {
        initializeSupabase(config.supabaseUrl, config.supabaseAnonKey);
      })
      .catch(error => console.error('Error fetching config:', error));
  }
  
// Initialize Supabase with fetched config
function initializeSupabase(url, key) {
    if (!window.supabase) {
        console.error('Supabase library not loaded');
        return;
    }
    supabase = window.supabase.createClient(url, key);
    console.log('Supabase has been initialized');
    console.log(`Your URL = ${url} `);
    console.log(`Your KEY = ${key} `);
  }


async function generatePoem() {
    var motherName = document.getElementById('motherName').value.trim();
    if (motherName === "") {
        alert("Please enter your mother's name.");
        return;
    }

    try {
        const response = await fetch('/generate-poem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: motherName })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch poem');
        }

        const data = await response.json();
        document.getElementById('nameDisplay').innerText = motherName;
        document.getElementById('poemContent').innerText = data.poem;
        document.getElementById('poemCard').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating poem. Please try again.');
    }
}

