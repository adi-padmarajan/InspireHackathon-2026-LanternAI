import requests

BASE = "http://localhost:8000"

def test_seasonal():
    print("\n=== Testing Seasonal ===")
    r = requests.post(f"{BASE}/api/context/seasonal", json={
        "weather": {"description": "Rainy", "temperature": 8, "condition": "Rain"},
        "location": "Victoria, BC"
    })
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.json()["success"] == True
    assert r.json()["data"]["tone"] == "cozy"

def test_action_script():
    print("\n=== Testing Action Script ===")
    r = requests.post(f"{BASE}/api/actions/script", json={
        "scenario": "extension_request",
        "tone": "gentle",
        "context": {"course": "CSC110", "deadline": "tomorrow"}
    })
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.json()["success"] == True
    assert "CSC110" in r.json()["data"]["script"]

def test_feedback():
    print("\n=== Testing Feedback ===")
    r = requests.post(f"{BASE}/api/feedback", json={
        "rating": 5,
        "note": "Test feedback",
        "context": {"playbook_id": "test"}
    })
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.json()["success"] == True

def test_events():
    print("\n=== Testing Events ===")
    r = requests.post(f"{BASE}/api/events", json={
        "event_type": "script_used",
        "payload": {"script_scenario": "extension_request"}
    })
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert r.json()["success"] == True

def test_scenarios():
    print("\n=== Testing Scenarios List ===")
    r = requests.get(f"{BASE}/api/actions/scenarios")
    print(f"Status: {r.status_code}")
    print(f"Response: {r.json()}")
    assert "extension_request" in r.json()["data"]["scenarios"]

if __name__ == "__main__":
    test_seasonal()
    test_action_script()
    test_feedback()
    test_events()
    test_scenarios()
    print("\n✅ All tests passed!")
