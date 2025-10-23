import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../shared/context/AuthProvider';
import useAxiosSecure from '../../shared/hooks/useAxiosSecure';
import { format } from 'date-fns';
import { FaSave, FaUser, FaUsers, FaBuilding, FaGlobe, FaMapMarkerAlt, FaPhoneAlt, FaImage } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, role: contextRole, updateUserRole } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const email = user?.email || '';

  const [role] = useState(contextRole || 'volunteer');
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Organizer-specific
  const [orgName, setOrgName] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgLogoURL, setOrgLogoURL] = useState('');
  const [orgType, setOrgType] = useState('ngo');
  const [causes, setCauses] = useState('');
  const [totalVolunteers, setTotalVolunteers] = useState('');
  const [eventsOrganized, setEventsOrganized] = useState(''); // newline separated: date - title - type
  const [upcomingEvents, setUpcomingEvents] = useState(''); // newline separated
  const [pastGalleryUrls, setPastGalleryUrls] = useState(''); // comma separated URLs
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [donationInfo, setDonationInfo] = useState('');

  // Volunteer-specific
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [availability, setAvailability] = useState('');
  const [volunteerType, setVolunteerType] = useState('both');
  const [pastEvents, setPastEvents] = useState(''); // newline separated
  const [certificates, setCertificates] = useState(''); // comma separated URLs
  const [totalHours, setTotalHours] = useState('');
  const [affiliations, setAffiliations] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [languages, setLanguages] = useState('');
  const [status, setStatus] = useState('active');
  const [rating, setRating] = useState('');

  // Social links (common)
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  const [uploading, setUploading] = useState(false);

  const memberSince = useMemo(() => {
    try {
      const ts = user?.metadata?.creationTime;
      return ts ? format(new Date(ts), 'MMMM d, yyyy') : '—';
    } catch {
      return '—';
    }
  }, [user]);

  // Load profile from API with local fallback
  useEffect(() => {
    if (!email) return;
    const load = async () => {
      try {
        const endpoint = (contextRole === 'organizer')
          ? `/profiles/organizer/${encodeURIComponent(email)}`
          : `/profiles/volunteer/${encodeURIComponent(email)}`;
        const res = await axiosSecure.get(endpoint);
        const p = res?.data || {};
        setPhone(p.phone || '');
        setLocation(p.location || '');
        setBio(p.bio || '');
        setOrgName(p.orgName || '');
        setOrgWebsite(p.orgWebsite || '');
        setOrgAddress(p.orgAddress || '');
        setSkills(p.skills || '');
        setInterests(p.interests || '');
        setAvailability(p.availability || '');
        if (p.name) setName(p.name);
        setPhotoURL(p.photoURL || '');
        setOrgLogoURL(p.orgLogoURL || '');
        setOrgType(p.orgType || 'ngo');
        setCauses(p.causes || '');
        setTotalVolunteers(p.totalVolunteers || '');
        setEventsOrganized(p.eventsOrganized || '');
        setUpcomingEvents(p.upcomingEvents || '');
        setPastGalleryUrls(p.pastGalleryUrls || '');
        setVerificationStatus(p.verificationStatus || 'pending');
        setLicenseNumber(p.licenseNumber || '');
        setDonationInfo(p.donationInfo || '');
        setVolunteerType(p.volunteerType || 'both');
        setPastEvents(p.pastEvents || '');
        setCertificates(p.certificates || '');
        setTotalHours(p.totalHours || '');
        setAffiliations(p.affiliations || '');
        setEmergencyName(p.emergencyName || '');
        setEmergencyRelation(p.emergencyRelation || '');
        setEmergencyPhone(p.emergencyPhone || '');
        setLanguages(p.languages || '');
        setStatus(p.status || 'active');
        setRating(p.rating || '');
        setFacebook(p.social?.facebook || '');
        setInstagram(p.social?.instagram || '');
        setLinkedin(p.social?.linkedin || '');
        setTwitter(p.social?.twitter || '');
      } catch {
        try {
          const raw = localStorage.getItem(`profile:${email}`);
          if (raw) {
            const p = JSON.parse(raw);
            setPhone(p.phone || '');
            setLocation(p.location || '');
            setBio(p.bio || '');
            setOrgName(p.orgName || '');
            setOrgWebsite(p.orgWebsite || '');
            setOrgAddress(p.orgAddress || '');
            setSkills(p.skills || '');
            setInterests(p.interests || '');
            setAvailability(p.availability || '');
            if (p.name) setName(p.name);
            setPhotoURL(p.photoURL || '');
            setOrgLogoURL(p.orgLogoURL || '');
            setOrgType(p.orgType || 'ngo');
            setCauses(p.causes || '');
            setTotalVolunteers(p.totalVolunteers || '');
            setEventsOrganized(p.eventsOrganized || '');
            setUpcomingEvents(p.upcomingEvents || '');
            setPastGalleryUrls(p.pastGalleryUrls || '');
            setVerificationStatus(p.verificationStatus || 'pending');
            setLicenseNumber(p.licenseNumber || '');
            setDonationInfo(p.donationInfo || '');
            setVolunteerType(p.volunteerType || 'both');
            setPastEvents(p.pastEvents || '');
            setCertificates(p.certificates || '');
            setTotalHours(p.totalHours || '');
            setAffiliations(p.affiliations || '');
            setEmergencyName(p.emergencyName || '');
            setEmergencyRelation(p.emergencyRelation || '');
            setEmergencyPhone(p.emergencyPhone || '');
            setLanguages(p.languages || '');
            setStatus(p.status || 'active');
            setRating(p.rating || '');
            setFacebook(p.facebook || '');
            setInstagram(p.instagram || '');
            setLinkedin(p.linkedin || '');
            setTwitter(p.twitter || '');
          }
        } catch {
          // ignore local fallback failure
        }
      }
    };
    load();
  }, [email, axiosSecure, contextRole]);

  const uploadToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey || !file) return null;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.success) return data.data.url;
      return null;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoFile = async (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadToImgBB(file);
    if (url) setter(url);
  };

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Validate required fields for backend PUT contract
    if (!name || !phone || !location) {
      Swal.fire({ icon: 'warning', title: 'Missing required fields', text: 'Name, phone and address are required.' });
      setSaving(false);
      return;
    }

    // Save to backend (single PUT /users/:email)
    try {
      await axiosSecure.put(`/users/${encodeURIComponent(email)}`, {
        name,
        phone,
        address: location,
        photoURL,
      });
      updateUserRole(role);
    } catch (err) {
      console.error('User profile PUT failed:', err?.response?.data || err.message);
      Swal.fire({ icon: 'error', title: 'Save failed', text: err?.response?.data?.message || 'Please try again' });
      setSaving(false);
      return;
    }

    // Save extended profile locally (until backend supports it)
    const extended = {
      email,
      name,
      role,
      phone,
      location,
      bio,
      photoURL,
      orgName,
      orgWebsite,
      orgAddress,
      orgLogoURL,
      orgType,
      causes,
      totalVolunteers,
      eventsOrganized,
      upcomingEvents,
      pastGalleryUrls,
      verificationStatus,
      licenseNumber,
      donationInfo,
      skills,
      interests,
      availability,
      volunteerType,
      pastEvents,
      certificates,
      totalHours,
      affiliations,
      emergencyName,
      emergencyRelation,
      emergencyPhone,
      languages,
      status,
      rating,
      social: { facebook, instagram, linkedin, twitter },
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`profile:${email}`, JSON.stringify(extended));

    // Local extended store (optional; backend does not accept these fields yet)
    Swal.fire({ icon: 'success', title: 'Profile saved', timer: 1500, showConfirmButton: false });
    setEditMode(false);
    setSaving(false);
  };

  const isOrganizer = role === 'organizer';
  const isVolunteer = role === 'volunteer';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Update your personal information and preferences</p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">Member since {memberSince}</div>
          {!editMode ? (
            <button type="button" onClick={() => setEditMode(true)} className="btn btn-outline btn-primary">Edit</button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditMode(false)} className="btn">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          )}
        </div>

        <fieldset disabled={!editMode} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full pl-10" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo</label>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {photoURL ? <img src={photoURL} alt="avatar" className="w-full h-full object-cover" /> : <FaImage className="absolute-center text-gray-500" />}
              </div>
              <input type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="input input-bordered flex-1" placeholder="https://..." />
              <input type="file" accept="image/*" onChange={(e) => handlePhotoFile(e, setPhotoURL)} className="file-input file-input-bordered" />
            </div>
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input value={email} readOnly className="input input-bordered w-full bg-gray-100 dark:bg-gray-700/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <div className="relative">
              <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input input-bordered w-full pl-10" placeholder="e.g. +1 555-1234" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="input input-bordered w-full pl-10" placeholder="City, Country" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="textarea textarea-bordered w-full" placeholder="Tell us about yourself"></textarea>
          </div>
        </div>

        {/* Role display */}
        <div>
          <span className="badge badge-primary capitalize">{role}</span>
        </div>

        {/* Organizer section */}
        {isOrganizer && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FaBuilding /> Organizer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Name</label>
                <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="input input-bordered w-full" placeholder="Your org" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Logo / Photo</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {orgLogoURL ? <img src={orgLogoURL} alt="logo" className="w-full h-full object-cover" /> : <FaImage className="absolute-center text-gray-500" />}
                  </div>
                  <input type="url" value={orgLogoURL} onChange={(e) => setOrgLogoURL(e.target.value)} className="input input-bordered flex-1" placeholder="https://..." />
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoFile(e, setOrgLogoURL)} className="file-input file-input-bordered" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
                <div className="relative">
                  <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} className="input input-bordered w-full pl-10" placeholder="https://example.org" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input value={orgAddress} onChange={(e) => setOrgAddress(e.target.value)} className="input input-bordered w-full" placeholder="Street, City, Country" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization Type</label>
                <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="select select-bordered w-full">
                  <option value="ngo">NGO</option>
                  <option value="club">Club</option>
                  <option value="personal">Personal Initiative</option>
                  <option value="company">Company</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Causes Supported</label>
                <input value={causes} onChange={(e) => setCauses(e.target.value)} className="input input-bordered w-full" placeholder="Education, Health, Environment" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Volunteers Registered</label>
                <input type="number" value={totalVolunteers} onChange={(e) => setTotalVolunteers(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Events Organized (one per line: YYYY-MM-DD - Title - Type)</label>
                <textarea value={eventsOrganized} onChange={(e) => setEventsOrganized(e.target.value)} rows={3} className="textarea textarea-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upcoming Events (one per line: YYYY-MM-DD - Title)</label>
                <textarea value={upcomingEvents} onChange={(e) => setUpcomingEvents(e.target.value)} rows={3} className="textarea textarea-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Past Event Gallery (image URLs, comma separated)</label>
                <textarea value={pastGalleryUrls} onChange={(e) => setPastGalleryUrls(e.target.value)} rows={2} className="textarea textarea-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Status</label>
                <select value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value)} className="select select-bordered w-full">
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License / Registration Number</label>
                <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank / Donation Info (Optional)</label>
                <textarea value={donationInfo} onChange={(e) => setDonationInfo(e.target.value)} rows={2} className="textarea textarea-bordered w-full" />
              </div>
            </div>
          </div>
        )}

        {/* Volunteer section */}
        {isVolunteer && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><FaUsers /> Volunteer Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma separated)</label>
                <input value={skills} onChange={(e) => setSkills(e.target.value)} className="input input-bordered w-full" placeholder="Teaching, First Aid" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Interests</label>
                <input value={interests} onChange={(e) => setInterests(e.target.value)} className="input input-bordered w-full" placeholder="Education, Environment" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="select select-bordered w-full">
                  <option value="">Select</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="evenings">Evenings</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volunteer Type</label>
                <select value={volunteerType} onChange={(e) => setVolunteerType(e.target.value)} className="select select-bordered w-full">
                  <option value="field">Field Volunteer</option>
                  <option value="online">Online Volunteer</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Past Events Participated (one per line: YYYY-MM-DD - Event - Role)</label>
                <textarea value={pastEvents} onChange={(e) => setPastEvents(e.target.value)} rows={3} className="textarea textarea-bordered w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Certificates / Achievements (image URLs, comma separated)</label>
                <textarea value={certificates} onChange={(e) => setCertificates(e.target.value)} rows={2} className="textarea textarea-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Volunteering Hours</label>
                <input type="number" value={totalHours} onChange={(e) => setTotalHours(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Organization(s) Affiliated</label>
                <input value={affiliations} onChange={(e) => setAffiliations(e.target.value)} className="input input-bordered w-full" placeholder="Org A, Org B" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact Name</label>
                <input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Relation</label>
                <input value={emergencyRelation} onChange={(e) => setEmergencyRelation(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Phone</label>
                <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Languages Spoken</label>
                <input value={languages} onChange={(e) => setLanguages(e.target.value)} className="input input-bordered w-full" placeholder="English, Bangla" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="select select-bordered w-full">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Joined</label>
                <input value={memberSince} readOnly className="input input-bordered w-full bg-gray-100 dark:bg-gray-700/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating / Feedback</label>
                <input value={rating} onChange={(e) => setRating(e.target.value)} className="input input-bordered w-full" placeholder="e.g., 4.8/5" />
              </div>
            </div>
          </div>
        )}

        {/* Social Links (common) */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className="input input-bordered w-full" placeholder="Facebook URL" />
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)} className="input input-bordered w-full" placeholder="Instagram URL" />
            <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="input input-bordered w-full" placeholder="LinkedIn URL" />
            <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="input input-bordered w-full" placeholder="Twitter URL" />
          </div>
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Profile;


