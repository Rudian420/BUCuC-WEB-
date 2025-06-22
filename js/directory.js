document.addEventListener('DOMContentLoaded', function() {

    const members = [
        // Panel Members
        { name: 'Aparup Chowdhury', position: 'President', image: 'images/artists/aparup.jpg', social: 'https://www.facebook.com/aparup.chy.77' },
        { name: 'Nafisa Noor', position: 'General Secretary', image: 'images/artists/nafisa.jpg', social: 'https://www.facebook.com/nafisa.noor.57685' },
        { name: 'Towkeer Mohammad Zia', position: 'Joint Secretary', image: 'images/artists/zia.jpg', social: 'https://www.facebook.com/towkeer.mohammad.zia.2024' },
        { name: 'Mamun Abdullah', position: 'Vice President', image: 'images/artists/mamun.jpg', social: 'https://www.facebook.com/aam099' },
        // SB Members
        { name: 'Rudian Borneel', position: 'Secretary of Human Resource', image: 'images/rudian.jpg', social: 'https://www.facebook.com/rudian.borneel' },
        { name: 'MD Sadman Safin Oasif', position: 'Secretary of Human Resource', image: 'images/MD_Sadman_Safin_Oasif.jpg', social: 'https://www.facebook.com/profile.php?id=100008597416622' },
        { name: 'Mahamudul Hossain Jisun', position: 'Secretary of Event Management & Logistics', image: 'images/Mahamudul_Hossain_Jisun.jpg', social: 'https://www.facebook.com/foggy.winter.007' },
        { name: 'Nilonjana Mojumder', position: 'Secretary of Event Management & Logistics', image: 'images/Nilonjana_Mojumder.jpg', social: 'https://www.facebook.com/arushi.lien' },
        { name: 'Showmik Safi', position: 'Secretary of Event Management & Logistics', image: 'images/Showmik_Safi.jpg', social: 'https://www.facebook.com/profile.php?id=100067106982577' },
        { name: 'Tamejul Habib', position: 'Secretary of Finance', image: 'images/Tamejul_habib.jpg', social: 'https://www.facebook.com/INCcharlie19' },
        { name: 'Nafisa Islam', position: 'Secretary of Creative', image: 'images/Nafisa_Islam.jpg', social: 'https://www.facebook.com/nafisaislamahona' },
        { name: 'Shreya Sangbriti', position: 'Secretary of Creative', image: 'images/Shreya_Sangbriti.jpg', social: 'https://web.facebook.com/shreyasangbriti#' },
        { name: 'Avibadhan Das', position: 'Secretary of Performance (Music)', image: 'images/Avibadhan_Das.jpg', social: 'https://www.facebook.com/avibadhan.dasarno' },
        { name: 'Lalon Mostafa', position: 'Secretary of Performance (Music)', image: 'images/Lalon.jpg', social: 'https://www.facebook.com/andalib.mostafa.1' },
        { name: 'Rudra Mathew Gomes', position: 'Secretary of Performance (Music)', image: 'images/Rudra_Mathew_Gomes.jpg', social: 'https://www.facebook.com/henry.ribeiro.33' },
        { name: 'Syed Ariful Islam Aowan', position: 'Secretary of Performance (Music)', image: 'images/Syed_Ariful_Islam_Aowan.jpg', social: 'https://www.facebook.com/syedariful.aowan' },
        { name: 'Rubaba Khijir Nusheen', position: 'Secretary of Performance (Dance)', image: 'images/Rubaba_Khijir_Nusheen.jpg', social: 'https://www.facebook.com/rubaba.nusheen' },
        { name: 'Maria Kamal Katha', position: 'Secretary of Performance (Dance)', image: 'images/Maria_Kamal_Katha.jpg', social: 'https://www.facebook.com/maria.kamal.katha' },
        { name: 'Diana Halder Momo', position: 'Secretary of Performance (Dance)', image: 'images/Diana_Halder_Momo.jpg', social: 'https://www.facebook.com/diana.momo.334' },
        { name: 'Jubair Rahman', position: 'Secretary of Performance (Dance)', image: 'images/Jubair_Rahman.jpg', social: 'https://www.facebook.com/jubair.rahman.765511' },
        { name: 'Fabiha Bushra Ali', position: 'Secretary of Public Relation', image: 'images/Fabiha_Bushra_Ali.jpg', social: 'https://www.facebook.com/fabooshu' },
        { name: 'Md Ahnaf Farhan', position: 'Secretary of Public Relation', image: 'images/Md_Ahnaf_Farhan.jpg', social: 'https://www.facebook.com/ahnaf.farhan.1' },
        { name: 'Khaled Bin Taher', position: 'Secretary of Public Relation', image: 'images/Khaled_Bin_Taher.jpg', social: 'https://www.facebook.com/Khaled.tahsin18' },
        { name: 'Lawrence Clifford Gomes', position: 'Secretary of Public Relation', image: 'images/Lawrence_Clifford_Gomes.jpg', social: 'https://www.facebook.com/Lcgomeslloyd' },
        { name: 'Jareen Tasnim Bushra', position: 'Secretary of Research & Development', image: 'images/Jareen_Tasnim_Bushra.jpg', social: 'https://www.facebook.com/buushraaaaaa21' },
        { name: 'Tasnimul Hasan', position: 'Secretary of Research & Development', image: 'images/Tasnimul_Hasan.jpg', social: 'https://www.facebook.com/buushraaaaaa21' },
    ];

    const memberGrid = document.getElementById('member-grid');
    const searchInput = document.getElementById('memberSearch');

    function displayMembers(filteredMembers) {
        memberGrid.innerHTML = '';
        filteredMembers.forEach(member => {
            const memberCard = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="member-card">
                        <img src="${member.image}" alt="${member.name}" onerror="this.src='images/logopng.png';">
                        <h5>${member.name}</h5>
                        <p>${member.position}</p>
                        <div class="member-social">
                            <a href="${member.social}" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        </div>
                    </div>
                </div>
            `;
            memberGrid.innerHTML += memberCard;
        });
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredMembers = members.filter(member => 
            member.name.toLowerCase().includes(searchTerm) || 
            member.position.toLowerCase().includes(searchTerm)
        );
        displayMembers(filteredMembers);
    });

    // Initial display
    displayMembers(members);
}); 