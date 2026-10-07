# Manual Image Setup

Your Flask application is looking for the following image files that are referenced in the HTML templates:

1. `squat.png`
2. `push_up.png`
3. `hammer_curl.png`

You need to place these files in this directory (`/static/images/`).

## Options:

1. **Use your own images**: 
   - Find or create suitable images for each exercise
   - Rename them as specified above
   - Place them in this directory

2. **Download sample images**:
   You can find suitable exercise images from various stock photo sites or fitness resources.

3. **Create simple placeholder images**:
   - Run the `create_static_folders.py` script in the project root
   - This will create simple placeholder images if you have PIL (Pillow) installed

## Image Size Guidelines:

- Recommended size: 200×200 pixels
- Keep file sizes small (under 100KB) for better performance
- PNG or JPG formats work best

Once you've added these images, refresh your browser and the 404 errors should be resolved.
