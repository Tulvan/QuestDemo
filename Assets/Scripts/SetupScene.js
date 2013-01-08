#pragma strict

var key: Transform; // holds key prefab (assigned from editor)
var portal: Transform; // holds portal prefab (assigned from editor)
var relic: Transform; // holds portal relic (assigned from editor)

var questMaterial : Material; // new quest item texture
var newQuestItem : Transform;

var questScript: QuestItem; // script reference

function Start () {
	newQuestItem = Instantiate(key, Vector3(-4.5, key.transform.renderer.bounds.size.y/2, -4.5), Quaternion.identity);
	// set the material appropriately
	questMaterial = Resources.Load("matKey1") as Material;
	newQuestItem.renderer.material = questMaterial;
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "key1";
	questScript.action = "destroy";
	questScript.itemType = "item";
	
	newQuestItem = Instantiate(key, Vector3(-4.5, key.transform.renderer.bounds.size.y/2, 4.5), Quaternion.identity);
	// set the material appropriately
	questMaterial = Resources.Load("matKey2") as Material;
	newQuestItem.renderer.material = questMaterial;
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "key2";
	questScript.action = "destroy";
	questScript.itemType = "item";

	newQuestItem = Instantiate(key, Vector3(-4.5, key.transform.renderer.bounds.size.y/2, 0), Quaternion.identity);
	// set the material appropriately
	questMaterial = Resources.Load("matKey3") as Material;
	newQuestItem.renderer.material = questMaterial;
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "key3";
	questScript.action = "destroy";
	questScript.itemType = "item";




	newQuestItem = Instantiate(portal, Vector3(4.5, portal.transform.renderer.bounds.size.y/2, 4.5), Quaternion.identity);
	// set the material appropriately
	questMaterial = Resources.Load("matPortal1") as Material;
	newQuestItem.renderer.material = questMaterial;
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "portal1";
	questScript.action = "changeMaterial";
	questScript.itemType = "door";
	questScript.status = "locked";
	questScript.newMaterial = "matPortal1Open";
	questScript.requirement = "key1";
	
	newQuestItem = Instantiate(portal, Vector3(4.5, portal.transform.renderer.bounds.size.y/2, -4.5), Quaternion.identity);
	// set the material appropriately
	questMaterial = Resources.Load("matPortal2") as Material;
	newQuestItem.renderer.material = questMaterial;
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "portal2";
	questScript.action = "changeMaterial";
	questScript.itemType = "door";
	questScript.status = "locked";
	questScript.newMaterial = "matPortal2Open";
	questScript.requirement = "key2";

	newQuestItem = Instantiate(portal, Vector3(4.5, portal.transform.renderer.bounds.size.y/2, 0), Quaternion.identity);

	// set the material appropriately
	questMaterial = Resources.Load("matPortal3") as Material;
	newQuestItem.renderer.material = questMaterial;
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "portal3";
	questScript.action = "changeMaterial";
	questScript.itemType = "door";
	questScript.status = "locked";
	questScript.newMaterial = "matPortal3Open";
	questScript.requirement = "key3";

	// can't use localScale.y here because the zombie isn't set to the same scale as the native objects
	newQuestItem = Instantiate(relic, Vector3(0, 0, 5.5), Quaternion.Euler(0, 180, 0));
	// set the script QuestItem.questId and QuestItem.itemName
	questScript = newQuestItem.GetComponent(QuestItem);
	questScript.questId = 1;
	questScript.itemName = "relic";
	questScript.action = "";
	questScript.itemType = "item";
}

function Update () {

}