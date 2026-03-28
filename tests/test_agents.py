import pytest
import asyncio
from backend.agents import run_pipeline

@pytest.mark.asyncio
async def test_run_pipeline():
    results = await run_pipeline()
    assert len(results) == 6
    assert all("symbol" in r for r in results)
    assert all("score" in r for r in results)
