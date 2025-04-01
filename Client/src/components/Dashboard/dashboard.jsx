import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();




function Dashboard() {
    const navigate = useNavigate(); // ✅ valid here
    const handleSelect = (propertyId) => {
        navigate(`/book/${propertyId}`);
      };
    const [properties, setProperties] = useState([]);
    const [cities, setCities] = useState([]);
    const [locations, setLocations] = useState([]);
    const [societies, setSocieties] = useState([]);
    const [sortBy, setSortBy] = useState('price_asc');
    const [filterCity, setFilterCity] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterSociety, setFilterSociety] = useState('');
    const [minArea, setMinArea] = useState('');
    const [maxArea, setMaxArea] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const navigate = useNavigate();

    // Sample Data
    const sampleCities = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai'];

    const sampleLocations = {
        'Mumbai': ['Andheri', 'Bandra', 'Powai'],
        'Delhi': ['Connaught Place', 'Dwarka', 'Saket'],
        'Bangalore': ['Indiranagar', 'Whitefield', 'Jayanagar'],
        'Kolkata': ['Salt Lake', 'New Town', 'Tollygunge'],
        'Chennai': ['T. Nagar', 'Adyar', 'Velachery']
    };
    
    const sampleSocieties = {
        'Andheri': ['Lokhandwala Complex', 'Oshiwara', 'Versova'],
        'Bandra': ['Pali Hill', 'Carter Road', 'Khar West'],
        'Powai': ['Hiranandani Gardens', 'Galleria Residences', 'Eden Gardens'],
        'Connaught Place': ['Rajiv Chowk', 'Janpath', 'Barakhamba Road'],
        'Dwarka': ['Sector 10', 'Sector 12', 'Sector 21'],
        'Saket': ['Select Citywalk Area', 'Freedom Fighter Enclave', 'Press Enclave'],
        'Indiranagar': ['HAL 2nd Stage', 'HAL 3rd Stage', 'Domlur Layout'],
        'Whitefield': ['Prestige Lakeside Habitat', 'Brigade Metropolis', 'Brookefield'],
        'Jayanagar': ['J.P. Nagar', 'South End Circle', 'Banashankari'],
        'Salt Lake': ['Sector 1', 'Sector 2', 'Sector 5'],
        'New Town': ['Action Area 1', 'Action Area 2', 'Action Area 3'],
        'Tollygunge': ['Golf Green', 'Karunamoyee', 'Netaji Nagar'],
        'T. Nagar': ['Gopalapuram', 'Nungambakkam', 'Kodambakkam'],
        'Adyar': ['Besant Nagar', 'Indira Nagar', 'Kottivakkam'],
        'Velachery': ['Guindy', 'Pallikaranai', 'Madipakkam']
    };
    
    const sampleProperties = [
        {
            id: 1,
            title: 'Luxury Apartment in Bandra',
            location: 'Bandra',
            city: 'Mumbai',
            society: 'Pali Hill',
            area: 1500,
            price: 25000000,
            rating: 4.8,
            image_url: 'https://www.guptasen.com/wp-content/uploads/2021/05/stunning-sea-facing-apartments-Bandra.jpg'
        },
        {
            id: 2,
            title: 'Spacious Villa in Whitefield',
            location: 'Whitefield',
            city: 'Bangalore',
            society: 'Prestige Lakeside Habitat',
            area: 2000,
            price: 18000000,
            rating: 4.7,
            image_url: 'https://teja12.kuikr.com/is/a/c/1200x500/gallery_images/original/cf5ee9bdacb3c92.gif'
        },
        {
            id: 3,
            title: 'Modern Flat in Connaught Place',
            location: 'Connaught Place',
            city: 'Delhi',
            society: 'Rajiv Chowk',
            area: 1800,
            price: 15000000,
            rating: 4.5,
            image_url: 'https://content.knightfrank.com/property/ccq012174638/images/84a8ff53-bd3c-45b2-bce9-b724f2170488-0.jpg?cio=true&w=1200'
        },
        {
            id: 4,
            title: 'Luxury Penthouse in Salt Lake Kolkata',
            location: 'Salt Lake',
            city: 'Kolkata',
            society: 'Sector 5',
            area: 2200,
            price: 13000000,
            rating: 4.6,
            image_url: 'https://www.realestate.com.au/blog/wp-content/uploads/2018/10/08120053/HOLD9998_Cobden-St_IN12_Double-Height-Penthouse-Void.jpg'
        },
        {
            id: 5,
            title: 'Elegant Home in T. Nagar',
            location: 'T. Nagar',
            city: 'Chennai',
            society: 'Gopalapuram',
            area: 1600,
            price: 12000000,
            rating: 4.4,
            image_url: 'https://eleganthomes.lk/wp-content/uploads/2020/07/20170926_180521-1.jpg'
        },
        {
            id: 6,
            title: 'Cozy Apartment in Powai',
            location: 'Powai',
            city: 'Mumbai',
            society: 'Hiranandani Gardens',
            area: 1400,
            price: 10000000,
            rating: 4.5,
            image_url: 'https://hiranandani.com/img/hira-gardens-powai/highland/showflat/2bhk/living-room.jpg'
        },
        {
            id: 7,
            title: 'Premium Residence in Jayanagar',
            location: 'Jayanagar',
            city: 'Bangalore',
            society: 'J.P. Nagar',
            area: 1900,
            price: 17000000,
            rating: 4.7,
            image_url: 'http://www.designmilieu.in/images/folio/residences/residence-jayanagar/hero.jpg'
        },
        {
            id: 8,
            title: 'Exclusive Bungalow in Adyar',
            location: 'Adyar',
            city: 'Chennai',
            society: 'Besant Nagar',
            area: 2500,
            price: 20000000,
            rating: 4.9,
            image_url: 'https://assets.architecturaldigest.in/photos/6008380ce6e1f64740188ef1/16:9/w_2560%2Cc_limit/new-delhi-house-of-greens-featured-image-1366x768.jpg'
        },
        {
            id: 9,
            title: 'High-Rise Apartment in New Town Kolkata',
            location: 'New Town',
            city: 'Kolkata',
            society: 'Action Area 1',
            area: 1700,
            price: 14000000,
            rating: 4.3,
            image_url: 'https://psgroup.in/blog/wp-content/uploads/2020/09/AURUS_Twilight-view.jpg'
        },
        {
            id: 10,
            title: 'Charming Flat in Dwarka',
            location: 'Dwarka',
            city: 'Delhi',
            society: 'Sector 12',
            area: 1300,
            price: 9000000,
            rating: 4.2,
            image_url: 'https://images.livspace-cdn.com/w:1440/plain/https://d3gq2merok8n5r.cloudfront.net/abhinav/ond-1634120396-Obfdc/jas-2023-1688629305-0KDli/homes-by-livspace-1689593286-ggz3B/new-folder-1689593443-SWMIU/1-1689593467-fLZcP.jpg'
        }
    ];
    
    // Initialize with sample data instead of fetching from API
    useEffect(() => {
        // Simulate API call delay
        setTimeout(() => {
            setCities(sampleCities);
            setProperties(sampleProperties);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (filterCity) {
            setLocations(sampleLocations[filterCity] || []);
        } else {
            setLocations([]);
            setFilterLocation('');
        }
        setSocieties([]);
        setFilterSociety('');
    }, [filterCity]);

    useEffect(() => {
        if (filterLocation) {
            setSocieties(sampleSocieties[filterLocation] || []);
        } else {
            setSocieties([]);
            setFilterSociety('');
        }
    }, [filterLocation]);

    useEffect(() => {
        // For sample data, filtering is handled locally
        let filtered = [...sampleProperties];

        if (filterCity) {
            filtered = filtered.filter(prop => prop.city === filterCity);
        }
        if (filterLocation) {
            filtered = filtered.filter(prop => prop.location === filterLocation);
        }
        if (filterSociety) {
            filtered = filtered.filter(prop => prop.society === filterSociety);
        }
        if (minArea) {
            filtered = filtered.filter(prop => prop.area >= parseInt(minArea));
        }
        if (maxArea) {
            filtered = filtered.filter(prop => prop.area <= parseInt(maxArea));
        }
        if (minRating) {
            filtered = filtered.filter(prop => prop.rating >= parseFloat(minRating));
        }
        if (maxRating) {
            filtered = filtered.filter(prop => prop.rating <= parseFloat(maxRating));
        }

        // Sorting
        if (sortBy === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating_desc') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        setProperties(filtered);
    }, [sortBy, filterCity, filterLocation, filterSociety, minArea, maxArea, minRating, maxRating]);

    const handleSortChange = (e) => setSortBy(e.target.value);
    const handleFilterCityChange = (e) => setFilterCity(e.target.value);
    const handleFilterLocationChange = (e) => setFilterLocation(e.target.value);
    const handleFilterSocietyChange = (e) => setFilterSociety(e.target.value);
    const handleMinAreaChange = (e) => setMinArea(e.target.value);
    const handleMaxAreaChange = (e) => setMaxArea(e.target.value);
    const handleMinRatingChange = (e) => setMinRating(e.target.value);
    const handleMaxRatingChange = (e) => setMaxRating(e.target.value);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login', { replace: true });
    };

    const handleClearFilters = () => {
        setSortBy('price_asc');
        setFilterCity('');
        setFilterLocation('');
        setFilterSociety('');
        setMinArea('');
        setMaxArea('');
        setMinRating('');
        setMaxRating('');
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="top-bar">
                    <h1>Property Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
                <main className="dashboard-content">
                    <p>Loading properties...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="top-bar">
                    <h1>Property Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </div>
                <main className="dashboard-content">
                    <p className="error">{error}</p>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="top-bar">
                <h1>Property Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <main className="dashboard-content">
                <h2>Available Properties</h2>
                <div className="controls">
                    <div className="sorting-controls">
                        <label htmlFor="sort">Sort By: </label>
                        <select id="sort" value={sortBy} onChange={handleSortChange}>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating_desc">Rating: High to Low</option>
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="city">City: </label>
                        <select id="city" value={filterCity} onChange={handleFilterCityChange}>
                            <option value="">All Cities</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="location">Location: </label>
                        <select id="location" value={filterLocation} onChange={handleFilterLocationChange} disabled={!filterCity}>
                            <option value="">All Locations</option>
                            {locations.map((location, index) => (
                                <option key={index} value={location}>{location}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="society">Society: </label>
                        <select id="society" value={filterSociety} onChange={handleFilterSocietyChange} disabled={!filterLocation}>
                            <option value="">All Societies</option>
                            {societies.map((society, index) => (
                                <option key={index} value={society}>{society}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="minArea">Min Area (sq ft): </label>
                        <input type="number" id="minArea" value={minArea} onChange={handleMinAreaChange} placeholder="e.g., 1000" min="0" />
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="maxArea">Max Area (sq ft): </label>
                        <input type="number" id="maxArea" value={maxArea} onChange={handleMaxAreaChange} placeholder="e.g., 3000" min="0" />
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="minRating">Min Rating: </label>
                        <input type="number" id="minRating" value={minRating} onChange={handleMinRatingChange} placeholder="e.g., 3.5" min="0" max="5" step="0.1" />
                    </div>
                    <div className="filtering-controls">
                        <label htmlFor="maxRating">Max Rating: </label>
                        <input type="number" id="maxRating" value={maxRating} onChange={handleMaxRatingChange} placeholder="e.g., 5" min="0" max="5" step="0.1" />
                    </div>
                    <div className="filtering-controls">
                        <button onClick={handleClearFilters} className="clear-filters-button">Clear Filters</button>
                    </div>
                </div>
                <div className="properties-list">
                    {properties.length > 0 ? (
                        properties.map(property => (
                            <div key={property.id} className="property-card">
                                {property.image_url && (
                                    <img src={property.image_url} alt={property.title} className="property-image" />
                                )}
                                <h3>{property.title}</h3>
                                <p><strong>Location:</strong> {property.location}</p>
                                <p><strong>City:</strong> {property.city}</p>
                                <p><strong>Society:</strong> {property.society}</p>
                                <p><strong>Area:</strong> {property.area} sq ft</p>
                                <p><strong>Price:</strong> ₹{property.price.toLocaleString()}</p>
                                <p><strong>Rating:</strong> {property.rating} ⭐</p>
                                <button id="select"onClick={() => handleSelect(property.id)}>Select</button>

                            </div>
                        ))
                    ) : (
                        <p>No properties found.</p>
                    )}
                </div>
            </main>
        </div>
    );

}

export default Dashboard;
