#!/usr/bin/env python3
"""
Test script for Pinecone integration with latest API
"""

import os
from dotenv import load_dotenv
from services.data_preparation import DataPreparationService

def test_pinecone_integration():
    """Test Pinecone integration with latest API"""
    print("Testing Pinecone Integration with Latest API")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Check if API key is available
    api_key = os.getenv('PINECONE_API_KEY')
    if not api_key:
        print("⚠ No PINECONE_API_KEY found in environment")
        print("   The system will use local storage only")
        print("   To test Pinecone, add your API key to .env file")
        return False
    
    try:
        # Initialize data preparation service
        print("Initializing DataPreparationService...")
        data_service = DataPreparationService()
        
        # Test if Pinecone is properly initialized
        if data_service.pinecone_index:
            print("✓ Pinecone index initialized successfully")
            
            # Initialize data if dataset exists
            dataset_path = "data/dataset.csv"
            if os.path.exists(dataset_path):
                print("Loading and preparing dataset...")
                data_service.clean_dataset(dataset_path)
                data_service.create_product_vectors()
                print("✓ Dataset prepared")
                
                # Test a simple query
                print("Testing search functionality...")
                test_query = "test product"
                results = data_service.search_products(test_query, top_k=1)
                
                if results:
                    print("✓ Search functionality working")
                    print(f"   Found {len(results)} results")
                else:
                    print("⚠ No search results (this is normal)")
            else:
                print("⚠ Dataset not found, Pinecone index ready but no data to test")
            
            return True
        else:
            print("✗ Pinecone index not initialized")
            return False
            
    except Exception as e:
        print(f"✗ Error testing Pinecone integration: {e}")
        return False

def test_local_fallback():
    """Test local storage fallback when Pinecone is not available"""
    print("\nTesting Local Storage Fallback")
    print("=" * 50)
    
    try:
        # Temporarily remove API key
        original_key = os.environ.get('PINECONE_API_KEY')
        if 'PINECONE_API_KEY' in os.environ:
            del os.environ['PINECONE_API_KEY']
        
        # Initialize service without Pinecone
        print("Initializing service without Pinecone API key...")
        data_service = DataPreparationService()
        
        # Initialize data if dataset exists
        dataset_path = "data/dataset.csv"
        if os.path.exists(dataset_path):
            print("Loading and preparing dataset...")
            data_service.clean_dataset(dataset_path)
            data_service.create_product_vectors()
            print("✓ Dataset prepared for local search")
            
            # Test local search
            print("Testing local search functionality...")
            test_query = "test product"
            results = data_service.search_products(test_query, top_k=1)
            
            if results is not None:
                print("✓ Local search fallback working")
                print(f"   Found {len(results)} results")
            else:
                print("⚠ No search results (this is normal)")
        else:
            print("⚠ Dataset not found, skipping local search test")
        
        # Restore API key
        if original_key:
            os.environ['PINECONE_API_KEY'] = original_key
        
        return True
        
    except Exception as e:
        print(f"✗ Error testing local fallback: {e}")
        return False

def main():
    """Main test function"""
    print("Pinecone Integration Test")
    print("=" * 50)
    
    # Test with Pinecone (if API key available)
    pinecone_success = test_pinecone_integration()
    
    # Test local fallback
    local_success = test_local_fallback()
    
    # Summary
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Pinecone Integration: {'✓' if pinecone_success else '✗'}")
    print(f"Local Fallback: {'✓' if local_success else '✗'}")
    
    if pinecone_success:
        print("\n✓ Pinecone integration is working correctly!")
    elif local_success:
        print("\n⚠ Pinecone not available, but local fallback is working")
        print("   Add PINECONE_API_KEY to .env file for full functionality")
    else:
        print("\n✗ Both Pinecone and local fallback failed")
        print("   Check your configuration and dependencies")

if __name__ == "__main__":
    main()