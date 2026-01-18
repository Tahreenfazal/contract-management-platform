import { useState } from "react";

function App() {
  // Blueprint state
  const [blueprintName, setBlueprintName] = useState("");
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState("Text");

  // Contract state
  const [contracts, setContracts] = useState([]);
  const [selectedContractBlueprint, setSelectedContractBlueprint] = useState(null);

  // --- Contract Lifecycle helper ---
  const getNextStatus = (status) => {
    if (status === "Created") return "Approved";
    if (status === "Approved") return "Sent";
    if (status === "Sent") return "Signed";
    if (status === "Signed") return "Locked";
    return status;
  };

  // Create blueprint
  const createBlueprint = () => {
    if (!blueprintName) return;
    setBlueprints([
      ...blueprints,
      { id: Date.now(), name: blueprintName, fields: [] },
    ]);
    setBlueprintName("");
  };

  // Add field to blueprint
  const addField = () => {
    if (!selectedBlueprintId || !fieldLabel) return;
    setBlueprints(
      blueprints.map((bp) =>
        bp.id === selectedBlueprintId
          ? {
              ...bp,
              fields: [...bp.fields, { label: fieldLabel, type: fieldType }],
            }
          : bp
      )
    );
    setFieldLabel("");
    setFieldType("Text");
  };

  // Generate contract from blueprint
  const generateContract = () => {
    if (!selectedContractBlueprint) return;

    const bp = blueprints.find(bp => bp.id === parseInt(selectedContractBlueprint));
    const newContract = {
      id: Date.now(),
      blueprintName: bp.name,
      fields: bp.fields.map(f => ({ ...f, value: "" })),
      status: "Created",
      createdAt: new Date().toLocaleDateString(),
    };
    setContracts([...contracts, newContract]);
  };

  // Handle contract field value change
  const handleFieldChange = (contractId, fieldLabel, value) => {
    setContracts(contracts.map(c => 
      c.id === contractId 
        ? {
            ...c,
            fields: c.fields.map(f => f.label === fieldLabel ? { ...f, value } : f)
          }
        : c
    ));
  };

  // --- Lifecycle actions ---
  const nextStatus = (contractId) => {
    setContracts(contracts.map(c => 
      c.id === contractId
        ? { ...c, status: getNextStatus(c.status) }
        : c
    ));
  };

  const revokeContract = (contractId) => {
    setContracts(contracts.map(c => 
      c.id === contractId
        ? { ...c, status: "Revoked" }
        : c
    ));
  };

  // --- Optional: filter dashboard by status ---
  const [filterStatus, setFilterStatus] = useState("All");
  const filteredContracts = contracts.filter(c => filterStatus === "All" || c.status === filterStatus);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Contract Management Platform</h1>

      {/* Blueprint creation */}
      <h2>Create Blueprint</h2>
      <input
        placeholder="Blueprint Name"
        value={blueprintName}
        onChange={(e) => setBlueprintName(e.target.value)}
      />
      <button onClick={createBlueprint}>Create</button>

      <h3>Existing Blueprints</h3>
      <ul>
        {blueprints.map((bp) => (
          <li key={bp.id}>
            <strong
              style={{
                cursor: "pointer",
                textDecoration: selectedBlueprintId === bp.id ? "underline" : "none",
              }}
              onClick={() => setSelectedBlueprintId(bp.id)}
            >
              {bp.name}
            </strong>
            {selectedBlueprintId === bp.id && (
              <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                <h4>Add Field</h4>
                <input
                  placeholder="Field Label"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                />
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                >
                  <option>Text</option>
                  <option>Date</option>
                  <option>Checkbox</option>
                  <option>Signature</option>
                </select>
                <button onClick={addField}>Add Field</button>

                <h4>Fields:</h4>
                <ul>
                  {bp.fields.map((f, index) => (
                    <li key={index}>
                      {f.label} ({f.type})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Contract Creation */}
      <h2>Create Contract from Blueprint</h2>
      <select
        value={selectedContractBlueprint || ""}
        onChange={(e) => setSelectedContractBlueprint(e.target.value)}
      >
        <option value="">Select Blueprint</option>
        {blueprints.map(bp => (
          <option key={bp.id} value={bp.id}>{bp.name}</option>
        ))}
      </select>
      <button onClick={generateContract}>Generate Contract</button>

      {/* Contract Dashboard */}
      <h2>Contracts Dashboard</h2>
      <label>Filter by Status: </label>
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="All">All</option>
        <option value="Created">Created</option>
        <option value="Approved">Approved</option>
        <option value="Sent">Sent</option>
        <option value="Signed">Signed</option>
        <option value="Locked">Locked</option>
        <option value="Revoked">Revoked</option>
      </select>

      <table border="1" cellPadding="5" style={{ marginTop: "10px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Contract Name</th>
            <th>Blueprint Name</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContracts.map(contract => (
            <tr key={contract.id}>
              <td>{contract.fields.find(f => f.label.toLowerCase().includes("name"))?.value || "Untitled"}</td>
              <td>{contract.blueprintName}</td>
              <td>{contract.status}</td>
              <td>{contract.createdAt}</td>
              <td>
                {contract.status !== "Locked" && contract.status !== "Revoked" && (
                  <button onClick={() => nextStatus(contract.id)}>Next Status</button>
                )}
                {(contract.status === "Created" || contract.status === "Sent") && (
                  <button onClick={() => revokeContract(contract.id)}>Revoke</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Individual contract editing */}
      {contracts.map(contract => (
        <div key={contract.id} style={{ marginTop: "20px" }}>
          <h4>{contract.blueprintName} - Status: {contract.status}</h4>
          {contract.status !== "Locked" && contract.status !== "Revoked" && (
            contract.fields.map(f => (
              <div key={f.label}>
                <label>{f.label} ({f.type}): </label>
                {f.type === "Checkbox" ? (
                  <input
                    type="checkbox"
                    checked={f.value}
                    onChange={(e) => handleFieldChange(contract.id, f.label, e.target.checked)}
                  />
                ) : (
                  <input
                    type={f.type === "Date" ? "date" : "text"}
                    value={f.value}
                    onChange={(e) => handleFieldChange(contract.id, f.label, e.target.value)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      ))}

    </div>
  );
}

export default App;
