import {useEffect, useState} from "react";
import './Items.css'
import {Link} from "react-router-dom";

function Items(){
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('')
    const [status, setStatus] = useState('')

    useEffect(() => {
        async function fetchItems(){
            const params = new URLSearchParams()

            if (search){
                params.append('search', search)
            }

            if (category){
                params.append('category', category)
            }

            if (status){
                params.append('status', status)
            }

            try{
                const response = await fetch(
                    `http://127.0.0.1:8000/api/items/?${params.toString()}`,
                )

                const data = await response.json()

                if (!response.ok){
                    throw new Error('Could not load items.')
                }

                setItems(data)
            } catch(error){
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }

        fetchItems()
    }, [search, category, status])

    if (loading){
        return <p className="items-message">Loading items...</p>
    }

    if (error){
        return <p className="items-error">{error}</p>
    }

    return(
        <div className="items-page">
            <section className="items-heading">
                <p className="items-eyebrow">FCCU LOST & FOUND DIRECTORY</p>
                <h1>
                    Browse <span>Items</span>
                </h1>
                <p>
                    Explore recently reported lost and found belongings from across
                    campus.
                </p>
            </section>

            <div className="items-filters">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title, description, or location"
                />

                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    <option value="">All categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="ID">ID</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Keys">Keys</option>
                    <option value="Bag">Bag</option>
                    <option value="Other">Other</option>
                </select>

                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="">All statuses</option>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                    <option value="Claimed">Claimed</option>
                </select>
            </div>

            {items.length === 0 ? (
                <p className="items-message">No items have been reported yet.</p>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <Link
                            className="item-card-link"
                            key={item.id}
                            to={`/items/${item.id}`}
                        >
                        <article
                            className={`item-card ${item.status === 'Claimed' ? 'item-card-claimed' : ''}`}
                        >
                            <div className="item-image-wrapper">
                                <img
                                    className="item-image"
                                    src={item.image}
                                    alt={item.title}
                                />

                                <span className="item-category">{item.category}</span>

                                {item.status === 'Claimed' && (
                                    <div className="claimed-mark" aria-label="Item claimed">
                                        <span>Claimed</span>
                                    </div>
                                )}
                            </div>

                            <div className="item-card-content">
                                <h2>{item.title}</h2>

                                <div className="item-details">
                                    <p>
                                        <span>Location</span>
                                        {item.location}
                                    </p>
                                    <p>
                                        <span>Date</span>
                                        {item.date_lost_found}
                                    </p>
                                </div>
                            </div>
                        </article>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Items
