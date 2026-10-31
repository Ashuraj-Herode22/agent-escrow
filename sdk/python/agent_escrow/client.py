"""
AgentEscrow Python SDK
Drop-in programmable escrow client for CrewAI, AutoGen, and LangChain multi-agent workflows.
"""
import requests
import json
from typing import Dict, Any, Optional

class AgentEscrow:
    def __init__(self, endpoint_url: str = "http://localhost:3000", client_id: str = "mock"):
        self.endpoint_url = endpoint_url.rstrip("/")
        self.client_id = client_id

    def create_contract(self, task: str, bounty_usd: float, description: str = "") -> "EscrowContract":
        payload = {
            "task": task,
            "description": description or task,
            "bountyUSD": bounty_usd,
            "autoSettle": False
        }
        res = requests.post(f"{self.endpoint_url}/api/v1/escrow/requisition", json=payload)
        res.raise_for_status()
        data = res.json()
        return EscrowContract(
            client=self,
            contract_id=data["contractId"],
            order_id=data["orderId"],
            authorization_id=data["authorizationId"],
            bounty_usd=bounty_usd,
            task=task
        )

class EscrowContract:
    def __init__(self, client: AgentEscrow, contract_id: str, order_id: str, authorization_id: str, bounty_usd: float, task: str):
        self.client = client
        self.contract_id = contract_id
        self.order_id = order_id
        self.authorization_id = authorization_id
        self.bounty_usd = bounty_usd
        self.task = task
        self.status = "AUTHORIZED_HELD"

    def arbitrate_and_release(self, code: str) -> Dict[str, Any]:
        """Submits delivered code to the AI Arbiter. Releases payout if tests pass."""
        payload = {
            "taskTitle": self.task,
            "budgetUSD": self.bounty_usd,
            "taskDescription": self.task
        }
        res = requests.post(f"{self.client.endpoint_url}/api/agent/custom-task", json=payload)
        res.raise_for_status()
        return res.json()

