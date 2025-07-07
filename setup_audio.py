#!/usr/bin/env python3
"""
Script to help set up the audio file for the radio app.
Run this script to copy your setup.mp3 file to the correct location.
"""

import os
import shutil
import sys

def setup_audio_file():
    """Copy setup.mp3 to the media directory"""
    
    # Define paths
    media_dir = os.path.join(os.getcwd(), 'media', 'audio')
    target_file = os.path.join(media_dir, 'setup.mp3')
    
    # Create media/audio directory if it doesn't exist
    os.makedirs(media_dir, exist_ok=True)
    
    print("🎵 Audio File Setup for Farmer's Radio")
    print("=" * 40)
    print(f"Target directory: {media_dir}")
    print(f"Target file: {target_file}")
    print()
    
    # Check if file already exists
    if os.path.exists(target_file):
        print("✅ setup.mp3 already exists in the media directory!")
        print(f"   Location: {target_file}")
        return True
    
    # Look for setup.mp3 in common locations
    possible_locations = [
        os.path.join(os.getcwd(), 'setup.mp3'),
        os.path.join(os.path.expanduser('~'), 'setup.mp3'),
        os.path.join(os.path.expanduser('~'), 'Downloads', 'setup.mp3'),
        os.path.join(os.path.expanduser('~'), 'Desktop', 'setup.mp3'),
        os.path.join(os.path.expanduser('~'), 'Music', 'setup.mp3'),
    ]
    
    source_file = None
    for location in possible_locations:
        if os.path.exists(location):
            source_file = location
            break
    
    if source_file:
        print(f"📁 Found setup.mp3 at: {source_file}")
        try:
            shutil.copy2(source_file, target_file)
            print(f"✅ Successfully copied to: {target_file}")
            print()
            print("🎉 Audio file setup complete!")
            print("   The 'Local Demo Station' will now use your setup.mp3 file.")
            return True
        except Exception as e:
            print(f"❌ Error copying file: {e}")
            return False
    else:
        print("❌ setup.mp3 not found in common locations.")
        print()
        print("📋 Manual setup instructions:")
        print("1. Locate your setup.mp3 file")
        print(f"2. Copy it to: {target_file}")
        print("3. Or run this command:")
        print(f"   cp /path/to/your/setup.mp3 {target_file}")
        print()
        print("🔍 Searched these locations:")
        for location in possible_locations:
            print(f"   - {location}")
        return False

if __name__ == "__main__":
    success = setup_audio_file()
    if not success:
        sys.exit(1)