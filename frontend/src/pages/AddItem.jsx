import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './AddItem.css'
import getErrorMessage from '../utils/getErrorMessage'

function AddItem(){
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        location: '',
        date_lost_found: '',
        status: '',
        contact_info: '',
        image: null,
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    function handleChange(event){
        const {name, value} = event.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    function handleImageChange(event){
        const image = event.target.files[0]
        setFormData({
            ...formData,
            image:image,
        })

    }

    async function handleSubmit(event){
        event.preventDefault()
        const itemData = new FormData()
        itemData.append('title', formData.title)
        itemData.append('category', formData.category)
        itemData.append('description', formData.description)
        itemData.append('location', formData.location)
        itemData.append('date_lost_found', formData.date_lost_found)
        itemData.append('status', formData.status)
        itemData.append('contact_info', formData.contact_info)
        itemData.append('image', formData.image)
        setError('')
        setLoading(true)

        try{
            const token = localStorage.getItem('token')

            if (!token){
                throw new Error('You must be logged in to report an item.')
            }

            const response = await fetch(
                'http://127.0.0.1:8000/api/items/',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: itemData,
                },
            )

            const data = await response.json()

            if (response.status === 401){
                throw new Error('Your session has expired. Please log in again to report an item.')
            }

            if (!response.ok){
                throw new Error(getErrorMessage(data))
            }

            setSuccess(true)

            setTimeout(() => {
                navigate('/my-items')
            }, 1500)
        } catch(error){
            setError(error.message)
        } finally{
            setLoading(false)
        }
    }

    return(
        <>
            {success && (
                <div className="success-overlay" role="status">
                    <div className="success-modal">
                        <span className="success-icon">✓</span>
                        <h2>Item reported successfully</h2>
                        <p>Redirecting to your items...</p>
                    </div>
                </div>
            )}

            <div className="add-item-page">
                <section className="add-item-intro">
                    <p className="add-item-eyebrow">FCCU LOST & FOUND</p>
                    <h1>
                        Report an <span>Item</span>
                    </h1>
                    <p>
                        Add clear information to help the FCCU community identify and
                        recover the item.
                    </p>
                </section>

                <form className="add-item-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="title">Item Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="For example, Black Wallet"
                    />
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select a category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="ID">ID</option>
                            <option value="Wallet">Wallet</option>
                            <option value="Keys">Keys</option>
                            <option value="Bag">Bag</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="">Select a status</option>
                            <option value="Lost">Lost</option>
                            <option value="Found">Found</option>
                        </select>
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the item and any identifying details"
                        maxLength="200"
                    />
                </div>

                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Where was it lost or found?"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="date_lost_found">Date</label>
                        <input
                            id="date_lost_found"
                            type="date"
                            name="date_lost_found"
                            value={formData.date_lost_found}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="contact_info">Contact Number</label>
                    <input
                        id="contact_info"
                        type="tel"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        placeholder="03XXXXXXXXX"
                        maxLength="11"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="image">Item Image</label>
                    <input
                        id="image"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button className="add-item-submit" type="submit" disabled={loading}>
                    {loading ? 'Reporting item...' : 'Report item'}
                </button>
                </form>
            </div>
        </>
    )
}

export default AddItem
