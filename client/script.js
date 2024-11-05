// Fetch projects and display them
async function fetchProjects() {
    const response = await fetch('/api/projects');
    const projects = await response.json();
  
    const projectList = document.getElementById("project-list");
    projectList.innerHTML = "";
  
    projects.forEach(project => {
      const projectDiv = document.createElement("div");
      projectDiv.className = "project";
      projectDiv.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p>Goal: $${project.goal}</p>
        <p>Current Funding: $${project.currentFunding}</p>
        <a href="/project.html?id=${project._id}">View Project</a>
      `;
      projectList.appendChild(projectDiv);
    });
  }
  
  // Handle contribution form submission
  async function handleContribution(event) {
    event.preventDefault();
  
    const amount = document.getElementById("amount").value;
    const response = await fetch('/contribute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: projectId, amount: amount })
    });
  
    const data = await response.json();
    if (data.success) {
      alert("Contribution successful!");
      fetchProjectDetails(); // Update project funding
    } else {
      alert("Payment failed: " + data.error);
    }
  }
  
  document.getElementById("contribution-form").addEventListener("submit", handleContribution);
  