import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import './AddItem.css'
import getErrorMessage from '../utils/getErrorMessage'

function EditItem(){
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
    const [currentImage, setCurrentImage] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchItem(){
            try{
                const response = await fetch(
                    `http://127.0.0.1:8000/api/items/${id}/`
                )

                const data = await response.json()

                if (!response.ok){
                    throw new Error('Could not load this item.')
                }

                setFormData({
                    title: data.title,
                    category: data.category,
                    description: data.description,
                    location: data.location,
                    date_lost_found: data.date_lost_found,
                    status: data.status,
                    contact_info: data.contact_info,
                    image: null,
                })
                setCurrentImage(data.image)
            } catch(error){
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }

        fetchItem()
    }, [id])

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
            image: image,
        })
    }

    async function handleSubmit(event){
        event.preventDefault()
        setError('')
        setSaving(true)

        const itemData = new FormData()
        itemData.append('title', formData.title)
        itemData.append('category', formData.category)
        itemData.append('description', formData.description)
        itemData.append('location', formData.location)
        itemData.append('date_lost_found', formData.date_lost_found)
        itemData.append('contact_info', formData.contact_info)

        if (formData.status !== 'Claimed'){
            itemData.append('status', formData.status)
        }

        if (formData.image){
            itemData.append('image', formData.image)
        }

        try{
            const token = localStorage.getItem('token')

            if (!token){
                throw new Error('You must be logged in to edit an item.')
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/items/${id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: itemData,
                },
            )

            const data = await response.json()

            if (response.status === 401){
                throw new Error('Your session has expired. Please log in again.')
            }

            if (response.status === 403){
                throw new Error('You can only edit items that you reported.')
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
            setSaving(false)
        }
    }

    if (loading){
        return <p className="items-message">Loading item...</p>
    }

    if (error && !formData.title){
        return <p className="items-error">{error}</p>
    }

    return(
        <>
            {success && (
                <div className="success-overlay" role="status">
                    <div className="success-modal">
                        <span className="success-icon">✓</span>
                        <h2>Item updated successfully</h2>
                        <p>Redirecting to your items...</p>
                    </div>
                </div>
            )}

            <div className="add-item-page">
                <section className="add-item-intro">
                    <p className="add-item-eyebrow">MANAGE YOUR REPORT</p>
                    <h1>
                        Edit <span>Item</span>
                    </h1>
                    <p>
                        Update the item information so other students see the latest
                        and most accurate details.
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
                                disabled={formData.status === 'Claimed'}
                            >
                                <option value="Lost">Lost</option>
                                <option value="Found">Found</option>
                                {formData.status === 'Claimed' && (
                                    <option value="Claimed">Claimed</option>
                                )}
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
                            maxLength="11"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="image">Replace Item Image</label>
                        <div className="current-item-image">
                            <img src={currentImage} alt={formData.title} />
                            <span>Current image</span>
                        </div>
                        <input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button className="add-item-submit" type="submit" disabled={saving}>
                        {saving ? 'Saving changes...' : 'Save changes'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default EditItem
