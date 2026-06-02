// ==========================================
    // CATEGORY / SUBCATEGORY LOGIC
    // ==========================================
    const categoryMap = {
        "Politics & World": ["Government & Policy", "Elections & Campaigns", "Global Diplomacy", "Conflicts & Crisis", "Human Rights", "Regional Updates"],
        "Business & Tech": ["Markets & Economy", "Startups & Crypto", "Artificial Intelligence", "Cybersecurity", "Consumer Electronics", "Software & Apps"],
        "Science & Environment": ["Climate & Weather", "Space Exploration", "Medical Research", "Renewable Energy", "Environmental Policy", "Nature & Biodiversity"],
        "Sports & Lifestyle": ["Cricket & Football", "Tennis & Motorsports", "Movies & Television", "Music Industry", "Gaming & eSports", "Travel & Culture"]
    };

    function updateSubCategories() {
        const mainSelect = document.getElementById("category");
        const subSelect = document.getElementById("subCategory");
        const selectedMain = mainSelect.value;

        subSelect.innerHTML = '<option value="" disabled selected>Select Sub Category...</option>';

        if (selectedMain && categoryMap[selectedMain]) {
            categoryMap[selectedMain].forEach(subCat => {
                const option = document.createElement("option");
                option.value = subCat;
                option.textContent = subCat;
                subSelect.appendChild(option);
            });
        }
    }

    // ==========================================
    // REFERENCES LOGIC
    // ==========================================
    let refCount = 1;
    const maxRefs = 5;
    const refContainer = document.getElementById('referencesContainer');
    const addBtn = document.getElementById('addReferenceBtn');

    function updateRemoveButtons() {
        const rows = refContainer.querySelectorAll('.reference-row');
        const removeBtns = refContainer.querySelectorAll('.btn-remove-ref');
        if (rows.length > 1) {
            removeBtns.forEach(btn => btn.style.display = 'inline-block');
        } else {
            removeBtns.forEach(btn => btn.style.display = 'none');
        }
    }

    addBtn.addEventListener('click', function() {
        if (refCount >= maxRefs) return;
        refCount++;
        const row = document.createElement('div');
        row.className = 'reference-row';
        row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px; align-items: center;';
        row.innerHTML = '<input type="text" name="refName[]" placeholder="Source Name (e.g. BBC News)" style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">' +
                        '<input type="url" name="refUrl[]" placeholder="https://..." style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">' +
                        '<button type="button" class="btn-remove-ref" style="background: #ef4444; color: white; border: none; border-radius: 6px; padding: 10px 12px; cursor: pointer;">✕</button>';
        refContainer.appendChild(row);

        row.querySelector('.btn-remove-ref').addEventListener('click', function() {
            row.remove();
            refCount--;
            updateRemoveButtons();
            if (refCount < maxRefs) addBtn.style.display = 'inline-block';
        });

        updateRemoveButtons();
        if (refCount >= maxRefs) addBtn.style.display = 'none';
    });