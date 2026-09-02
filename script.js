// ==========================================
// SUPABASE CONFIGURATION
// ==========================================
// Replace these with your Supabase credentials
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentGalleryId = null;
let currentGalleryName = null;
let isOwner = false;
let selectedPhotos = [];

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  // Check if viewing existing gallery
  const params = new URLSearchParams(window.location.search);
  const galleryId = params.get('id');

  if (galleryId) {
    currentGalleryId = galleryId;
    const isOwnerCheck = localStorage.getItem(`owner_${galleryId}`);
    isOwner = isOwnerCheck === 'true';
    await loadGallery(galleryId);
  }
});

// ==========================================
// CREATE GALLERY
// ==========================================
async function createGallery() {
  const galleryName = document.getElementById('galleryName').value.trim();

  if (!galleryName) {
    alert('Please enter a gallery name! 💗');
    return;
  }

  try {
    // Generate unique ID
    const galleryId = 'gallery_' + Math.random().toString(36).substr(2, 9);

    // Store gallery metadata in Supabase
    const { data, error } = await supabase
      .from('galleries')
      .insert([
        {
          id: galleryId,
          name: galleryName,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    // Set owner in localStorage
    localStorage.setItem(`owner_${galleryId}`, 'true');
    currentGalleryId = galleryId;
    currentGalleryName = galleryName;
    isOwner = true;

    // Show owner section
    document.getElementById('createSection').classList.add('hidden');
    document.getElementById('ownerSection').classList.remove('hidden');

    // Set gallery link
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${galleryId}`;
    document.getElementById('galleryLink').innerHTML = `
      <strong>Gallery Created! 🎉</strong><br>
      Your gallery "<strong>${galleryName}</strong>" is ready!
    `;
    document.getElementById('shareLink').value = shareUrl;

    console.log('Gallery created:', galleryId);
  } catch (error) {
    console.error('Error creating gallery:', error);
    alert('Error creating gallery! Please try again.');
  }
}

// ==========================================
// PHOTO PREVIEW
// ==========================================
document.addEventListener('change', (e) => {
  if (e.target.id === 'photoInput') {
    selectedPhotos = Array.from(e.target.files);
    displayPreview();
  }
});

function displayPreview() {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';

  selectedPhotos.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.cursor = 'pointer';
      img.onclick = () => removePhoto(index);
      img.title = 'Click to remove';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

function removePhoto(index) {
  selectedPhotos.splice(index, 1);
  displayPreview();
}

// ==========================================
// SAVE PHOTOS
// ==========================================
async function savePhotos() {
  if (!isOwner) {
    alert('You are not the owner of this gallery!');
    return;
  }

  if (selectedPhotos.length === 0) {
    alert('Please select at least one photo! 📸');
    return;
  }

  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Uploading photos... ⏳';
  statusEl.className = 'success';
  statusEl.style.display = 'block';

  try {
    for (const file of selectedPhotos) {
      const fileName = `${currentGalleryId}/${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Store photo metadata in database
      const { error: dbError } = await supabase
        .from('photos')
        .insert([
          {
            gallery_id: currentGalleryId,
            file_path: fileName,
            uploaded_at: new Date().toISOString(),
          },
        ]);

      if (dbError) throw dbError;
    }

    statusEl.textContent = '✅ Photos uploaded successfully! 💗';
    statusEl.className = 'success';

    // Clear preview
    selectedPhotos = [];
    document.getElementById('photoInput').value = '';
    displayPreview();

    // Reload gallery
    setTimeout(() => await loadGallery(currentGalleryId), 1000);
  } catch (error) {
    console.error('Error saving photos:', error);
    statusEl.textContent = '❌ Error uploading photos. Please try again.';
    statusEl.className = 'error';
  }
}

// ==========================================
// LOAD GALLERY
// ==========================================
async function loadGallery(galleryId) {
  try {
    // Get gallery info
    const { data: galleryData, error: galleryError } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', galleryId)
      .single();

    if (galleryError) throw galleryError;

    currentGalleryName = galleryData.name;
    document.getElementById('viewerTitle').textContent = `${currentGalleryName} 💗`;

    // Get photos
    const { data: photosData, error: photosError } = await supabase
      .from('photos')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('uploaded_at', { ascending: false });

    if (photosError) throw photosError;

    // Display gallery
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    if (photosData.length === 0) {
      gallery.innerHTML =
        '<p style="grid-column: 1/-1; text-align: center; color: #999;">No photos yet... 📸</p>';
    } else {
      for (const photo of photosData) {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery-photos')
          .getPublicUrl(photo.file_path);

        const item = document.createElement('div');
        item.className = 'galleryItem';
        item.innerHTML = `
          <img src="${urlData.publicUrl}" alt="Memory">
          <div class="overlay">
            <p>💗</p>
          </div>
        `;
        gallery.appendChild(item);
      }
    }

    // Show appropriate section
    document.getElementById('createSection').classList.add('hidden');
    document.getElementById('viewerSection').classList.remove('hidden');

    if (isOwner) {
      document.getElementById('ownerSection').classList.remove('hidden');
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${galleryId}`;
      document.getElementById('galleryLink').innerHTML = `
        <strong>Gallery: ${currentGalleryName}</strong>
      `;
      document.getElementById('shareLink').value = shareUrl;
    }
  } catch (error) {
    console.error('Error loading gallery:', error);
    alert('Gallery not found or an error occurred! 💔');
  }
}

// ==========================================
// COPY SHARE LINK
// ==========================================
function copyLink() {
  const shareLink = document.getElementById('shareLink');
  shareLink.select();
  document.execCommand('copy');

  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = '✅ Copied!';
  btn.style.background = '#28a745';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 2000);
}