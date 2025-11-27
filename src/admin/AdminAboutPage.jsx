import { useState, useEffect } from "react";
import { aboutAPI } from "../services/api";
import { toast } from "react-toastify";

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data states
  const [galleryItems, setGalleryItems] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState([]);
  const [coreValues, setCoreValues] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);

  // Form states
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    image: "",
    specs: [""],
    price: "",
    isActive: true
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    title: "",
    image: "",
    bio: "",
    email: "",
    linkedin: "",
    category: "operations",
    order: 0,
    isActive: true
  });

  const [statForm, setStatForm] = useState({
    label: "",
    value: "",
    icon: "",
    order: 0,
    isActive: true
  });

  const [coreValueForm, setCoreValueForm] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    title: "",
    content: "",
    rating: 5,
    image: "",
    location: "",
    isActive: true,
    isFeatured: false
  });

  const [companyForm, setCompanyForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroKeywords: [""],
    heroBackgroundImage: "",
    aboutDescription: "",
    mission: "",
    vision: "",
    foundedYear: "",
    location: ""
  });

  // Edit states
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      switch (activeTab) {
        case "gallery":
          const galleryData = await aboutAPI.getAllGalleryItems();
          setGalleryItems(galleryData.galleryItems || []);
          break;
        case "team":
          const teamData = await aboutAPI.getAllTeamMembers();
          setTeamMembers(teamData.teamMembers || []);
          break;
        case "stats":
          const statsData = await aboutAPI.getAllStats();
          setStats(statsData.stats || []);
          break;
        case "coreValues":
          const valuesData = await aboutAPI.getAllCoreValues();
          setCoreValues(valuesData.coreValues || []);
          break;
        case "testimonials":
          const testimonialsData = await aboutAPI.getAllTestimonials();
          setTestimonials(testimonialsData.testimonials || []);
          break;
        case "company":
          const companyData = await aboutAPI.getCompanyInfo();
          setCompanyInfo(companyData.companyInfo);
          if (companyData.companyInfo) {
            setCompanyForm(companyData.companyInfo);
          }
          break;
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data");
      toast.error(`Failed to load ${activeTab} data`);
    } finally {
      setLoading(false);
    }
  };

  // Gallery handlers
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredSpecs = galleryForm.specs.filter(spec => spec.trim() !== "");
      const dataToSubmit = {
        ...galleryForm,
        specs: filteredSpecs,
        price: galleryForm.price ? Number(galleryForm.price) : undefined
      };

      if (editingId) {
        await aboutAPI.updateGalleryItem(editingId, dataToSubmit);
        toast.success("Gallery item updated successfully");
      } else {
        await aboutAPI.createGalleryItem(dataToSubmit);
        toast.success("Gallery item created successfully");
      }
      setGalleryForm({ title: "", image: "", specs: [""], price: "", isActive: true });
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save gallery item");
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await aboutAPI.deleteGalleryItem(id);
        toast.success("Gallery item deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete gallery item");
      }
    }
  };

  // Team handlers
  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...teamForm,
        order: Number(teamForm.order)
      };

      if (editingId) {
        await aboutAPI.updateTeamMember(editingId, dataToSubmit);
        toast.success("Team member updated successfully");
      } else {
        await aboutAPI.createTeamMember(dataToSubmit);
        toast.success("Team member created successfully");
      }
      setTeamForm({
        name: "",
        title: "",
        image: "",
        bio: "",
        email: "",
        linkedin: "",
        category: "operations",
        order: 0,
        isActive: true
      });
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save team member");
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await aboutAPI.deleteTeamMember(id);
        toast.success("Team member deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete team member");
      }
    }
  };

  // Stats handlers
  const handleStatSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...statForm,
        order: Number(statForm.order)
      };

      if (editingId) {
        await aboutAPI.updateStat(editingId, dataToSubmit);
        toast.success("Stat updated successfully");
      } else {
        await aboutAPI.createStat(dataToSubmit);
        toast.success("Stat created successfully");
      }
      setStatForm({ label: "", value: "", icon: "", order: 0, isActive: true });
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save stat");
    }
  };

  const handleDeleteStat = async (id) => {
    if (window.confirm("Are you sure you want to delete this stat?")) {
      try {
        await aboutAPI.deleteStat(id);
        toast.success("Stat deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete stat");
      }
    }
  };

  // Core Values handlers
  const handleCoreValueSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...coreValueForm,
        order: Number(coreValueForm.order)
      };

      if (editingId) {
        await aboutAPI.updateCoreValue(editingId, dataToSubmit);
        toast.success("Core value updated successfully");
      } else {
        await aboutAPI.createCoreValue(dataToSubmit);
        toast.success("Core value created successfully");
      }
      setCoreValueForm({ title: "", description: "", icon: "", order: 0, isActive: true });
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save core value");
    }
  };

  const handleDeleteCoreValue = async (id) => {
    if (window.confirm("Are you sure you want to delete this core value?")) {
      try {
        await aboutAPI.deleteCoreValue(id);
        toast.success("Core value deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete core value");
      }
    }
  };

  // Testimonials handlers
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...testimonialForm,
        rating: Number(testimonialForm.rating)
      };

      if (editingId) {
        await aboutAPI.updateTestimonial(editingId, dataToSubmit);
        toast.success("Testimonial updated successfully");
      } else {
        await aboutAPI.createTestimonial(dataToSubmit);
        toast.success("Testimonial created successfully");
      }
      setTestimonialForm({
        name: "",
        title: "",
        content: "",
        rating: 5,
        image: "",
        location: "",
        isActive: true,
        isFeatured: false
      });
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save testimonial");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await aboutAPI.deleteTestimonial(id);
        toast.success("Testimonial deleted successfully");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete testimonial");
      }
    }
  };

  // Company Info handler
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      const filteredKeywords = companyForm.heroKeywords.filter(kw => kw.trim() !== "");
      const dataToSubmit = {
        ...companyForm,
        heroKeywords: filteredKeywords,
        foundedYear: companyForm.foundedYear ? Number(companyForm.foundedYear) : undefined
      };

      await aboutAPI.updateCompanyInfo(dataToSubmit);
      toast.success("Company info updated successfully");
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to update company info");
    }
  };

  // Helper function to add array fields
  const addArrayField = (formType, field) => {
    switch (formType) {
      case "gallery":
        setGalleryForm(prev => ({
          ...prev,
          [field]: [...prev[field], ""]
        }));
        break;
      case "company":
        setCompanyForm(prev => ({
          ...prev,
          [field]: [...prev[field], ""]
        }));
        break;
    }
  };

  // Helper function to update array fields
  const updateArrayField = (formType, field, index, value) => {
    switch (formType) {
      case "gallery":
        setGalleryForm(prev => {
          const updated = [...prev[field]];
          updated[index] = value;
          return { ...prev, [field]: updated };
        });
        break;
      case "company":
        setCompanyForm(prev => {
          const updated = [...prev[field]];
          updated[index] = value;
          return { ...prev, [field]: updated };
        });
        break;
    }
  };

  // Helper function to remove array fields
  const removeArrayField = (formType, field, index) => {
    switch (formType) {
      case "gallery":
        setGalleryForm(prev => ({
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
        }));
        break;
      case "company":
        setCompanyForm(prev => ({
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
        }));
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage About Page</h1>
      
      <div className="flex items-center gap-2 mb-6">
        <a 
          href="/about" 
          target="_blank" 
          className="text-blue-600 hover:underline"
        >
          View Live Page →
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
          <button 
            onClick={() => setError("")} 
            className="float-right text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {["gallery", "team", "stats", "coreValues", "testimonials", "company"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab === "coreValues" ? "Core Values" : 
               tab === "company" ? "Company Info" :
               tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Gallery Item</h2>
          <form onSubmit={handleGallerySubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={galleryForm.title}
                onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Price (optional)"
                value={galleryForm.price}
                onChange={(e) => setGalleryForm({...galleryForm, price: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>
            <input
              type="text"
              placeholder="Image URL"
              value={galleryForm.image}
              onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              required
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Specifications</label>
              {galleryForm.specs.map((spec, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Specification"
                    value={spec}
                    onChange={(e) => updateArrayField("gallery", "specs", index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  {galleryForm.specs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("gallery", "specs", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("gallery", "specs")}
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Specification
              </button>
            </div>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={galleryForm.isActive}
                onChange={(e) => setGalleryForm({...galleryForm, isActive: e.target.checked})}
              />
              <span>Active (visible on website)</span>
            </label>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              {editingId ? "Update" : "Add"} Gallery Item
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setGalleryForm({ title: "", image: "", specs: [""], price: "", isActive: true });
                }}
                className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Gallery Items List */}
          <div className="grid gap-4">
            {galleryItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.price && <p className="text-gray-600">₹{item.price.toLocaleString()}</p>}
                    <ul className="mt-2 text-sm text-gray-600">
                      {item.specs.map((spec, i) => (
                        <li key={i}>• {spec}</li>
                      ))}
                    </ul>
                    <p className="text-sm mt-2">
                      Status: <span className={item.isActive ? "text-green-600" : "text-red-600"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setGalleryForm(item);
                        setEditingId(item._id);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGalleryItem(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Team Member</h2>
          <form onSubmit={handleTeamSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={teamForm.name}
                onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Title/Position"
                value={teamForm.title}
                onChange={(e) => setTeamForm({...teamForm, title: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select
                value={teamForm.category}
                onChange={(e) => setTeamForm({...teamForm, category: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="leadership">Leadership</option>
                <option value="operations">Operations</option>
                <option value="support">Customer Support</option>
                <option value="creative">Creative</option>
              </select>
              <input
                type="number"
                placeholder="Order"
                value={teamForm.order}
                onChange={(e) => setTeamForm({...teamForm, order: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>

            <input
              type="text"
              placeholder="Image URL"
              value={teamForm.image}
              onChange={(e) => setTeamForm({...teamForm, image: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              required
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="email"
                placeholder="Email (optional)"
                value={teamForm.email}
                onChange={(e) => setTeamForm({...teamForm, email: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="url"
                placeholder="LinkedIn URL (optional)"
                value={teamForm.linkedin}
                onChange={(e) => setTeamForm({...teamForm, linkedin: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>

            <textarea
              placeholder="Bio (optional)"
              value={teamForm.bio}
              onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              rows="3"
            />

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={teamForm.isActive}
                onChange={(e) => setTeamForm({...teamForm, isActive: e.target.checked})}
              />
              <span>Active (visible on website)</span>
            </label>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              {editingId ? "Update" : "Add"} Team Member
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTeamForm({
                    name: "",
                    title: "",
                    image: "",
                    bio: "",
                    email: "",
                    linkedin: "",
                    category: "operations",
                    order: 0,
                    isActive: true
                  });
                }}
                className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Team Members List */}
          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <div key={member._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.title}</p>
                    <p className="text-sm text-gray-500">Category: {member.category} | Order: {member.order}</p>
                    {member.bio && <p className="text-sm mt-2">{member.bio}</p>}
                    <p className="text-sm mt-2">
                      Status: <span className={member.isActive ? "text-green-600" : "text-red-600"}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTeamForm(member);
                        setEditingId(member._id);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeamMember(member._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Stat</h2>
          <form onSubmit={handleStatSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Label (e.g., Custom Builds)"
                value={statForm.label}
                onChange={(e) => setStatForm({...statForm, label: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Value (e.g., 10,000+)"
                value={statForm.value}
                onChange={(e) => setStatForm({...statForm, value: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Icon (optional)"
                value={statForm.icon}
                onChange={(e) => setStatForm({...statForm, icon: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Order"
                value={statForm.order}
                onChange={(e) => setStatForm({...statForm, order: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={statForm.isActive}
                onChange={(e) => setStatForm({...statForm, isActive: e.target.checked})}
              />
              <span>Active (visible on website)</span>
            </label>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              {editingId ? "Update" : "Add"} Stat
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setStatForm({ label: "", value: "", icon: "", order: 0, isActive: true });
                }}
                className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Stats List */}
          <div className="grid gap-4">
            {stats.map((stat) => (
              <div key={stat._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                    <p className="text-sm text-gray-500">Order: {stat.order}</p>
                    <p className="text-sm mt-2">
                      Status: <span className={stat.isActive ? "text-green-600" : "text-red-600"}>
                        {stat.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setStatForm(stat);
                        setEditingId(stat._id);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStat(stat._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Values Tab */}
      {activeTab === "coreValues" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Core Value</h2>
          <form onSubmit={handleCoreValueSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title (e.g., Performance)"
                value={coreValueForm.title}
                onChange={(e) => setCoreValueForm({...coreValueForm, title: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Order"
                value={coreValueForm.order}
                onChange={(e) => setCoreValueForm({...coreValueForm, order: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>
            
            <textarea
              placeholder="Description"
              value={coreValueForm.description}
              onChange={(e) => setCoreValueForm({...coreValueForm, description: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              rows="3"
              required
            />

            <input
              type="text"
              placeholder="Icon (optional)"
              value={coreValueForm.icon}
              onChange={(e) => setCoreValueForm({...coreValueForm, icon: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={coreValueForm.isActive}
                onChange={(e) => setCoreValueForm({...coreValueForm, isActive: e.target.checked})}
              />
              <span>Active (visible on website)</span>
            </label>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              {editingId ? "Update" : "Add"} Core Value
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setCoreValueForm({ title: "", description: "", icon: "", order: 0, isActive: true });
                }}
                className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Core Values List */}
          <div className="grid gap-4">
            {coreValues.map((value) => (
              <div key={value._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Order: {value.order}</p>
                    <p className="text-sm mt-2">
                      Status: <span className={value.isActive ? "text-green-600" : "text-red-600"}>
                        {value.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCoreValueForm(value);
                        setEditingId(value._id);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCoreValue(value._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === "testimonials" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Testimonial</h2>
          <form onSubmit={handleTestimonialSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={testimonialForm.title}
                onChange={(e) => setTestimonialForm({...testimonialForm, title: e.target.value})}
                className="border rounded px-3 py-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Location (optional)"
                value={testimonialForm.location}
                onChange={(e) => setTestimonialForm({...testimonialForm, location: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Rating"
                min="1"
                max="5"
                value={testimonialForm.rating}
                onChange={(e) => setTestimonialForm({...testimonialForm, rating: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>

            <input
              type="text"
              placeholder="Image URL (optional)"
              value={testimonialForm.image}
              onChange={(e) => setTestimonialForm({...testimonialForm, image: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <textarea
              placeholder="Testimonial Content"
              value={testimonialForm.content}
              onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              rows="4"
              required
            />

            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testimonialForm.isActive}
                  onChange={(e) => setTestimonialForm({...testimonialForm, isActive: e.target.checked})}
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={testimonialForm.isFeatured}
                  onChange={(e) => setTestimonialForm({...testimonialForm, isFeatured: e.target.checked})}
                />
                <span>Featured</span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              {editingId ? "Update" : "Add"} Testimonial
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTestimonialForm({
                    name: "",
                    title: "",
                    content: "",
                    rating: 5,
                    image: "",
                    location: "",
                    isActive: true,
                    isFeatured: false
                  });
                }}
                className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </form>

          {/* Testimonials List */}
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{testimonial.title}</h3>
                    <p className="text-gray-600">{testimonial.name} - {testimonial.location}</p>
                    <p className="text-sm mt-2">{testimonial.content}</p>
                    <p className="text-yellow-500 mt-2">{"★".repeat(testimonial.rating)}</p>
                    <p className="text-sm mt-2">
                      Status: <span className={testimonial.isActive ? "text-green-600" : "text-red-600"}>
                        {testimonial.isActive ? "Active" : "Inactive"}
                      </span>
                      {testimonial.isFeatured && <span className="ml-2 text-purple-600">Featured</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTestimonialForm(testimonial);
                        setEditingId(testimonial._id);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(testimonial._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Info Tab */}
      {activeTab === "company" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
          <form onSubmit={handleCompanySubmit} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Hero Title"
                value={companyForm.heroTitle}
                onChange={(e) => setCompanyForm({...companyForm, heroTitle: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Hero Subtitle"
                value={companyForm.heroSubtitle}
                onChange={(e) => setCompanyForm({...companyForm, heroSubtitle: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>

            <input
              type="text"
              placeholder="Hero Background Image URL"
              value={companyForm.heroBackgroundImage}
              onChange={(e) => setCompanyForm({...companyForm, heroBackgroundImage: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Hero Keywords (rotating text)</label>
              {companyForm.heroKeywords.map((keyword, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Keyword"
                    value={keyword}
                    onChange={(e) => updateArrayField("company", "heroKeywords", index, e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  {companyForm.heroKeywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("company", "heroKeywords", index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("company", "heroKeywords")}
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Keyword
              </button>
            </div>

            <textarea
              placeholder="About Description"
              value={companyForm.aboutDescription}
              onChange={(e) => setCompanyForm({...companyForm, aboutDescription: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              rows="3"
            />

            <textarea
              placeholder="Mission"
              value={companyForm.mission}
              onChange={(e) => setCompanyForm({...companyForm, mission: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              rows="3"
            />

            <textarea
              placeholder="Vision"
              value={companyForm.vision}
              onChange={(e) => setCompanyForm({...companyForm, vision: e.target.value})}
              className="w-full border rounded px-3 py-2 mb-4"
              rows="3"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="number"
                placeholder="Founded Year"
                value={companyForm.foundedYear}
                onChange={(e) => setCompanyForm({...companyForm, foundedYear: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Location"
                value={companyForm.location}
                onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Update Company Info
            </button>
          </form>
        </div>
      )}
    </div>
  );
}