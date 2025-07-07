#!/usr/bin/env python3
"""
Script to copy your setup.mp3 file to the correct media directory.
"""

import os
import shutil
import sys

def copy_audio_file():
    """Copy setup.mp3 to the media/audio directory"""
    
    # Create media/audio directory
    media_dir = os.path.join('media', 'audio')
    os.makedirs(media_dir, exist_ok=True)
    
    target_file = os.path.join(media_dir, 'setup.mp3')
    
    print("🎵 Setting up audio file for Farmer's Radio")
    print("=" * 45)
    
    # Check if already exists
    if os.path.exists(target_file):
        print(f"✅ setup.mp3 already exists at: {target_file}")
        return True
    
    # Look for setup.mp3 in current directory and common locations
    search_paths = [
        'setup.mp3',  # Current directory
        os.path.expanduser('~/setup.mp3'),  # Home directory
        os.path.expanduser('~/Downloads/setup.mp3'),  # Downloads
        os.path.expanduser('~/Desktop/setup.mp3'),  # Desktop
        os.path.expanduser('~/Music/setup.mp3'),  # Music folder
    ]
    
    source_file = None
    for path in search_paths:
        if os.path.exists(path):
            source_file = path
            break
    
    if source_file:
        try:
            shutil.copy2(source_file, target_file)
            print(f"✅ Successfully copied from: {source_file}")
            print(f"   To: {target_file}")
            print("\n🎉 Audio setup complete!")
            print("   The 'Local Demo Station' will now use your setup.mp3 file.")
            return True
        except Exception as e:
            print(f"❌ Error copying file: {e}")
            return False
    else:
        print("❌ setup.mp3 not found in common locations.")
        print("\n📋 Manual setup:")
        print(f"   1. Copy your setup.mp3 file to: {target_file}")
        print("   2. Or place setup.mp3 in the current directory and run this script again")
        print("\n🔍 Searched locations:")
        for path in search_paths:
            print(f"   - {path}")
        return False

if __name__ == "__main__":
    success = copy_audio_file()
    if not success:
        print("\n💡 You can still use the app with online radio stations!")
        print("   The other stations will work without the local file.")