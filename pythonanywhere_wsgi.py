"""
WSGI config for PythonAnywhere deployment
"""
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/raphael80/NeuroScanAI_2'  # Change 'raphael80' to your PythonAnywhere username
sys.path.insert(0, project_home)

# Load the Flask app
from app import app as application
