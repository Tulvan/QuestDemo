#pragma strict

var hit : RaycastHit; // returns the object clicked on

var scrQuestLog: QuestLog; // script reference
var scrQuestItem: QuestItem;
var scrInventory: Inventory;

/*
	If the object clicked is of type QuestItem.type == "inventory", this function is run.
	Primary: It adds the QuestItem.itemName to the Inventory.aryInventory array.
		Secondary: If it is flagged as QuestItem.action == "destroy", the world object is destroyed.
		Secondary: Else if the QuestItem.action == "changeMaterial", it is modified, but left on screen.
*/
function AddToInventory(hit: RaycastHit) {
	var tmpObject = hit.collider.gameObject;
	if (tmpObject.tag == "quest") {
		// get its QuestItem script
		scrQuestItem = tmpObject.GetComponent(QuestItem);

		scrInventory = GameObject.Find("First Person Controller").GetComponent(Inventory);
		scrInventory.aryInventory.Add(scrQuestItem.itemName);

		scrQuestLog = GameObject.Find("GUI").GetComponent(QuestLog);
		scrQuestLog.EvaluateStatus(scrQuestItem.questId);
	}

	// take appropriate action
	if (scrQuestItem.action == "destroy")
		Destroy(tmpObject);
	else if (scrQuestItem.action == "changeMaterial")
	{
		tmpObject.renderer.material = Resources.Load(scrQuestItem.newMaterial) as Material;
	}
} // end function AddToInventory(hit: RaycastHit)

/*
	Handles ALL input, not just keyboard.
*/
function Update () {
	var tmpScript : MouseLook;
	var saveCameraRotation: Quaternion;
	var scrQuestItem: QuestItem;

	// enabled/disable mouselook	
	if(Input.GetKeyDown(KeyCode.Mouse1))
	{
		tmpScript = GameObject.Find("Main Camera").GetComponent(MouseLook);
		tmpScript.enabled = true;
//		if (saveCameraRotation == Quaternion.identity)
//			saveCameraRotation = GameObject.Find("Main Camera").transform.rotation;
	}
	else if (Input.GetKeyUp(KeyCode.Mouse1))
	{
		tmpScript = GameObject.Find("Main Camera").GetComponent(MouseLook);
//		tmpScript.enabled = false;
		Camera.mainCamera.transform.rotation = transform.rotation;
//		GameObject.Find("Main Camera").transform.rotation = GameObject.Find("First Person Controller").transform.rotation;
		
		saveCameraRotation = Quaternion.identity;
	}

	// handle clicking on screen
    if(Input.GetKeyDown(KeyCode.Mouse0))
    {
    	// if they clicked on anything EXCEPT the ground, just get out
    	if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hit))
    	{
    		// if whatever was clicked on does not have a script attached to it, ignore the click
    		if (hit.transform.gameObject.GetComponent(QuestItem) == null)
    			return;
    			
    		if (hit.distance > 2)
    		{
    			scrQuestItem = hit.transform.gameObject.GetComponent(QuestItem);
    			Debug.Log("Too far away to pick up " + scrQuestItem.itemName + ".");
    		}
    		else
    		{
	    		var tmpObject: GameObject = hit.transform.gameObject;
	    		scrQuestItem = tmpObject.GetComponent(QuestItem);
	    		// if its an item, add it to inventory
	    		if (scrQuestItem.itemType == "item")
		    		AddToInventory(hit);
		    	else if (scrQuestItem.itemType == "door")
		    	{
		    		// check if it is locked. If not, open it
		    		if (scrQuestItem.status == "unlocked") {
		    			tmpObject.renderer.material = Resources.Load(scrQuestItem.newMaterial) as Material;
						scrQuestLog = GameObject.Find("GUI").GetComponent(QuestLog);
						scrQuestLog.EvaluateStatus(scrQuestItem.questId);
		    		}
		    		else {
		    			var scrInventory: Inventory = GameObject.Find("First Person Controller").GetComponent(Inventory); 
		    			// if we have the key, unlock and open the door
		    			if (scrInventory.aryInventory.Contains(scrQuestItem.requirement))
		    			{
		    				scrQuestItem.status = "unlocked";
							tmpObject.renderer.material = Resources.Load(scrQuestItem.newMaterial) as Material;
							scrQuestLog = GameObject.Find("GUI").GetComponent(QuestLog);
							scrQuestLog.EvaluateStatus(scrQuestItem.questId);
						}
		    		}
		    	} // end else if (scrQuestItem.itemType == "door")
    		}  // end else.  if (hit.distance > 2)
		} // end if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hit))
	} // end if(Input.GetKeyDown(KeyCode.Mouse0))

	// Access menus etc through the keyboard
	if (Input.GetKeyUp(KeyCode.L))
	{
		QuestLog.showQuestLog = !QuestLog.showQuestLog;
	}
	
	// Movement - can come from WASD or arrows. Eventually will have GUI input too (for mobile)
	if (Input.GetKeyUp(KeyCode.W) || Input.GetKeyUp(KeyCode.UpArrow))
	{
		// move forward
		if (okToMove("Forward"))
			MoveCharacter("Forward");
	}
	else if  (Input.GetKeyUp(KeyCode.A))
	{
		// move left
		if (okToMove("Left"))
			MoveCharacter("Left");
	}
	else if  (Input.GetKeyUp(KeyCode.D))
	{
		// move right
		if (okToMove("Right"))
			MoveCharacter("Right");
	}
	else if  (Input.GetKeyUp(KeyCode.S) || Input.GetKeyUp(KeyCode.DownArrow))
	{
		// move backwards
		if (okToMove("Backward"))
			MoveCharacter("Backward");
	}
	else if  (Input.GetKeyUp(KeyCode.Q) || Input.GetKeyUp(KeyCode.LeftArrow))
	{
		// turn left
		TurnCharacter("Left");
	}
	else if  (Input.GetKeyUp(KeyCode.E) || Input.GetKeyUp(KeyCode.RightArrow))
	{
		// turn right
		TurnCharacter("Right");
	}
} // end function Update ()

/* 
	Check if it is ok to move as passed in. It does this by actually moving there, then
	seeing if that is off the grid. If it IS off the grid, the character is moved back
	and false is returned. If it is still on the grid, then the character is moved back
	and true is returned.
*/
function okToMove(direction: String) {
	var undoMove : Vector3;
	
	if (direction == "Forward")
	{
		transform.Translate(Vector3.forward);
		undoMove = Vector3.back;
	}
	else if (direction == "Left")
	{
		transform.Translate(Vector3.left);
		undoMove = Vector3.right;
	}
	else if (direction == "Right")
	{
		transform.Translate(Vector3.right);
		undoMove = Vector3.left;
	}
	else if (direction == "Backward")
	{
		transform.Translate(Vector3.back);
		undoMove = Vector3.forward;
	}
	else // should never get here, but if we do, tell the caller not to do anything
	{
		return false;
	}

	if (transform.position.x < -5 || transform.position.x > 5 || transform.position.z < -5 || transform.position.z > 5)
	{
		transform.Translate(undoMove);
		return false;
	}
	else
	{
		transform.Translate(undoMove);
		return true;
	}
} // end function okToMove(var direction: string)

/* 
	Moves the character as simply as possible by just transform.Translate by the appropriate 
	Vector3. It conveniently has .forward, .back, .left, and .right. Doesn't get easier than that!
*/
function MoveCharacter(direction: String) {
	if (direction == "Forward")
	{
		// 1. reset orientation to looking straight forward - no idea how
		GameObject.Find("Main Camera").transform.rotation = transform.rotation; // reorient FPC main camera
		transform.Translate(Vector3.forward);
	}
	else if (direction == "Left")
	{
		transform.Translate(Vector3.left);
	}
	else if (direction == "Right")
	{
		transform.Translate(Vector3.right);
	}
	else if (direction == "Backward")
	{
		transform.Translate(Vector3.back);
	}
} // end function MoveCharacter(var direction: String)

/*
	Again, simple. We just rotate the First Person Controller -90 degrees to turn left,
	or +90 degress to turn right.
*/
function TurnCharacter(direction: String) {
	if (direction == "Left")
	{
		transform.rotation *= Quaternion.Euler(0, -90, 0); // rotate left
	}
	else if (direction == "Right")
	{	
		transform.rotation *= Quaternion.Euler(0, 90, 0); // rotate right
	}
} // end function TurnCharacter(var direction: String)