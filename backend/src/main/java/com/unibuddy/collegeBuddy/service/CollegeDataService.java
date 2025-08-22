package com.unibuddy.collegeBuddy.service;

import com.unibuddy.collegeBuddy.entity.College;
import com.unibuddy.collegeBuddy.repository.CollegeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollegeDataService implements CommandLineRunner {
    
    private final CollegeRepository collegeRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (collegeRepository.count() == 0) {
            log.info("Initializing college data...");
            initializeColleges();
            log.info("College data initialization completed.");
        } else {
            log.info("College data already exists, skipping initialization.");
        }
    }
    
    private void initializeColleges() {
        List<CollegeData> colleges = getIndianCollegesData();
        
        for (CollegeData collegeData : colleges) {
            College college = new College();
            college.setName(collegeData.getName());
            college.setDomain(collegeData.getDomain());
            college.setVerified(collegeData.isVerified());
            collegeRepository.save(college);
        }
        
        log.info("Saved {} colleges to database", colleges.size());
    }
    
    private List<CollegeData> getIndianCollegesData() {
        return Arrays.asList(
            // IITs (Indian Institutes of Technology)
            new CollegeData("Indian Institute of Technology Bombay", "iitb.ac.in", true),
            new CollegeData("Indian Institute of Technology Delhi", "iitd.ac.in", true),
            new CollegeData("Indian Institute of Technology Kanpur", "iitk.ac.in", true),
            new CollegeData("Indian Institute of Technology Kharagpur", "iitkgp.ac.in", true),
            new CollegeData("Indian Institute of Technology Madras", "iitm.ac.in", true),
            new CollegeData("Indian Institute of Technology Roorkee", "iitr.ac.in", true),
            new CollegeData("Indian Institute of Technology Guwahati", "iitg.ac.in", true),
            new CollegeData("Indian Institute of Technology Hyderabad", "iith.ac.in", true),
            new CollegeData("Indian Institute of Technology Indore", "iiti.ac.in", true),
            new CollegeData("Indian Institute of Technology Mandi", "iitmandi.ac.in", true),
            new CollegeData("Indian Institute of Technology Ropar", "iitrpr.ac.in", true),
            new CollegeData("Indian Institute of Technology Bhubaneswar", "iitbbs.ac.in", true),
            new CollegeData("Indian Institute of Technology Gandhinagar", "iitgn.ac.in", true),
            new CollegeData("Indian Institute of Technology Jodhpur", "iitj.ac.in", true),
            new CollegeData("Indian Institute of Technology Patna", "iitp.ac.in", true),
            new CollegeData("Indian Institute of Technology Varanasi (BHU)", "iitbhu.ac.in", true),
            new CollegeData("Indian Institute of Technology Palakkad", "iitpkd.ac.in", true),
            new CollegeData("Indian Institute of Technology Tirupati", "iittp.ac.in", true),
            new CollegeData("Indian Institute of Technology Dhanbad", "iitism.ac.in", true),
            new CollegeData("Indian Institute of Technology Goa", "iitgoa.ac.in", true),
            new CollegeData("Indian Institute of Technology Bhilai", "iitbhilai.ac.in", true),
            new CollegeData("Indian Institute of Technology Jammu", "iitjammu.ac.in", true),
            new CollegeData("Indian Institute of Technology Dharwad", "iitdh.ac.in", true),
            
            // IIMs (Indian Institutes of Management)
            new CollegeData("Indian Institute of Management Ahmedabad", "iima.ac.in", true),
            new CollegeData("Indian Institute of Management Bangalore", "iimb.ac.in", true),
            new CollegeData("Indian Institute of Management Calcutta", "iimcal.ac.in", true),
            new CollegeData("Indian Institute of Management Lucknow", "iiml.ac.in", true),
            new CollegeData("Indian Institute of Management Kozhikode", "iimk.ac.in", true),
            new CollegeData("Indian Institute of Management Indore", "iimidr.ac.in", true),
            new CollegeData("Indian Institute of Management Shillong", "iimshillong.ac.in", true),
            new CollegeData("Indian Institute of Management Rohtak", "iimrohtak.ac.in", true),
            new CollegeData("Indian Institute of Management Raipur", "iimraipur.ac.in", true),
            new CollegeData("Indian Institute of Management Ranchi", "iimranchi.ac.in", true),
            new CollegeData("Indian Institute of Management Trichy", "iimtrichy.ac.in", true),
            new CollegeData("Indian Institute of Management Udaipur", "iimu.ac.in", true),
            new CollegeData("Indian Institute of Management Kashipur", "iimkashipur.ac.in", true),
            new CollegeData("Indian Institute of Management Amritsar", "iimamritsar.ac.in", true),
            new CollegeData("Indian Institute of Management Bodh Gaya", "iimbg.ac.in", true),
            new CollegeData("Indian Institute of Management Nagpur", "iimnagpur.ac.in", true),
            new CollegeData("Indian Institute of Management Visakhapatnam", "iimv.ac.in", true),
            new CollegeData("Indian Institute of Management Sirmaur", "iimsirmaur.ac.in", true),
            new CollegeData("Indian Institute of Management Sambalpur", "iimsambalpur.ac.in", true),
            new CollegeData("Indian Institute of Management Jammu", "iimjammu.ac.in", true),
            
            // NITs (National Institutes of Technology)
            new CollegeData("National Institute of Technology Trichy", "nitt.edu", true),
            new CollegeData("National Institute of Technology Warangal", "nitw.ac.in", true),
            new CollegeData("National Institute of Technology Surathkal", "nitk.ac.in", true),
            new CollegeData("National Institute of Technology Calicut", "nitc.ac.in", true),
            new CollegeData("National Institute of Technology Rourkela", "nitrkl.ac.in", true),
            new CollegeData("National Institute of Technology Kurukshetra", "nitkkr.ac.in", true),
            new CollegeData("National Institute of Technology Durgapur", "nitdgp.ac.in", true),
            new CollegeData("National Institute of Technology Jamshedpur", "nitjsr.ac.in", true),
            new CollegeData("National Institute of Technology Allahabad", "mnnit.ac.in", true),
            new CollegeData("National Institute of Technology Bhopal", "manit.ac.in", true),
            new CollegeData("National Institute of Technology Jalandhar", "nitj.ac.in", true),
            new CollegeData("National Institute of Technology Patna", "nitp.ac.in", true),
            new CollegeData("National Institute of Technology Raipur", "nitrr.ac.in", true),
            new CollegeData("National Institute of Technology Agartala", "nita.ac.in", true),
            new CollegeData("National Institute of Technology Arunachal Pradesh", "nitap.ac.in", true),
            new CollegeData("National Institute of Technology Delhi", "nitdelhi.ac.in", true),
            new CollegeData("National Institute of Technology Goa", "nitgoa.ac.in", true),
            new CollegeData("National Institute of Technology Hamirpur", "nith.ac.in", true),
            new CollegeData("National Institute of Technology Manipur", "nitmanipur.ac.in", true),
            new CollegeData("National Institute of Technology Meghalaya", "nitm.ac.in", true),
            new CollegeData("National Institute of Technology Mizoram", "nitmz.ac.in", true),
            new CollegeData("National Institute of Technology Nagaland", "nitnagaland.ac.in", true),
            new CollegeData("National Institute of Technology Puducherry", "nitpy.ac.in", true),
            new CollegeData("National Institute of Technology Sikkim", "nitsikkim.ac.in", true),
            new CollegeData("National Institute of Technology Srinagar", "nitsri.ac.in", true),
            new CollegeData("National Institute of Technology Uttarakhand", "nituk.ac.in", true),
            new CollegeData("National Institute of Technology Andhra Pradesh", "nitandhra.ac.in", true),
            
            // IIITs (Indian Institutes of Information Technology)
            new CollegeData("International Institute of Information Technology Hyderabad", "iiit.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Allahabad", "iiita.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Gwalior", "iiitm.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Jabalpur", "iiitdmj.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Kancheepuram", "iiitdm.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Design and Manufacturing Kurnool", "iiitk.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Vadodara", "iiitvadodara.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Nagpur", "iiitn.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Pune", "iiitpune.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Kota", "iiitkota.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Guwahati", "iiitg.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Kalyani", "iiitkalyani.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Lucknow", "iiitl.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Manipur", "iiitmanipur.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Sri City", "iiits.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Surat", "iiitsurat.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Tiruchirappalli", "iiitt.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Una", "iiitu.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Sonepat", "iiitsonepat.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Bhopal", "iiitbhopal.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Bhagalpur", "iiitbh.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Agartala", "iiitagartala.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Kottayam", "iiitkottayam.ac.in", true),
            new CollegeData("Indian Institute of Information Technology Ranchi", "iiitranchi.ac.in", true),
            
            // Central Universities
            new CollegeData("Jawaharlal Nehru University", "jnu.ac.in", true),
            new CollegeData("University of Delhi", "du.ac.in", true),
            new CollegeData("Aligarh Muslim University", "amu.ac.in", true),
            new CollegeData("Banaras Hindu University", "bhu.ac.in", true),
            new CollegeData("Jamia Millia Islamia", "jmi.ac.in", true),
            new CollegeData("University of Hyderabad", "uohyd.ac.in", true),
            new CollegeData("Jadavpur University", "jaduniv.edu.in", true),
            new CollegeData("Pondicherry University", "pondiuni.edu.in", true),
            new CollegeData("Tezpur University", "tezu.ernet.in", true),
            new CollegeData("North Eastern Hill University", "nehu.ac.in", true),
            new CollegeData("Assam University", "aus.ac.in", true),
            new CollegeData("Manipur University", "manipuruniv.ac.in", true),
            new CollegeData("Mizoram University", "mzu.edu.in", true),
            new CollegeData("Nagaland University", "nagalanduniversity.ac.in", true),
            new CollegeData("Tripura University", "tripurauniv.in", true),
            new CollegeData("Sikkim University", "cus.ac.in", true),
            new CollegeData("Rajiv Gandhi University", "rgu.ac.in", true),
            new CollegeData("Hemvati Nandan Bahuguna Garhwal University", "hnbgu.ac.in", true),
            new CollegeData("Babasaheb Bhimrao Ambedkar University", "bbau.ac.in", true),
            new CollegeData("Dr. Harisingh Gour Vishwavidyalaya", "dhsgsu.ac.in", true),
            new CollegeData("Maulana Azad National Urdu University", "manuu.ac.in", true),
            new CollegeData("Indira Gandhi National Open University", "ignou.ac.in", true),
            new CollegeData("English and Foreign Languages University", "efluniversity.ac.in", true),
            new CollegeData("Mahatma Gandhi Antarrashtriya Hindi Vishwavidyalaya", "hindivishwa.org", true),
            new CollegeData("Central University of South Bihar", "cusb.ac.in", true),
            new CollegeData("Central University of Bihar", "cub.ac.in", true),
            new CollegeData("Central University of Jharkhand", "cuj.ac.in", true),
            new CollegeData("Central University of Orissa", "cuo.ac.in", true),
            new CollegeData("Central University of Gujarat", "cug.ac.in", true),
            new CollegeData("Central University of Haryana", "cuh.ac.in", true),
            new CollegeData("Central University of Himachal Pradesh", "cuhimachal.ac.in", true),
            new CollegeData("Central University of Jammu", "cujammu.ac.in", true),
            new CollegeData("Central University of Kashmir", "cukashmir.ac.in", true),
            new CollegeData("Central University of Kerala", "cukerala.ac.in", true),
            new CollegeData("Central University of Karnataka", "cukarnaka.ac.in", true),
            new CollegeData("Central University of Punjab", "cup.edu.in", true),
            new CollegeData("Central University of Rajasthan", "curaj.ac.in", true),
            new CollegeData("Central University of Tamil Nadu", "cutn.ac.in", true),
            
            // State Universities
            new CollegeData("Anna University", "annauniv.edu", true),
            new CollegeData("University of Mumbai", "mu.ac.in", true),
            new CollegeData("University of Pune", "unipune.ac.in", true),
            new CollegeData("University of Calcutta", "caluniv.ac.in", true),
            new CollegeData("University of Madras", "unom.ac.in", true),
            new CollegeData("Osmania University", "osmania.ac.in", true),
            new CollegeData("Andhra University", "andhrauniversity.edu.in", true),
            new CollegeData("Kerala University", "keralauniversity.ac.in", true),
            new CollegeData("Cochin University of Science and Technology", "cusat.ac.in", true),
            new CollegeData("Mahatma Gandhi University", "mgu.ac.in", true),
            new CollegeData("Calicut University", "uoc.ac.in", true),
            new CollegeData("Bharathiar University", "b-u.ac.in", true),
            new CollegeData("Madurai Kamaraj University", "mkuniversity.org", true),
            new CollegeData("Bharathidasan University", "bdu.ac.in", true),
            new CollegeData("Periyar University", "periyaruniversity.ac.in", true),
            new CollegeData("Thiruvalluvar University", "tvu.edu.in", true),
            new CollegeData("Tamil Nadu Agricultural University", "tnau.ac.in", true),
            new CollegeData("Karunya Institute of Technology and Sciences", "karunya.edu", true),
            new CollegeData("SRM Institute of Science and Technology", "srmist.edu.in", true),
            new CollegeData("VIT University", "vitastudent.ac.in", true),
            new CollegeData("VIT-AP University", "vitapstudent.ac.in", true),
            new CollegeData("Vellore Institute of Technology", "vit.ac.in", true),
            new CollegeData("Amrita Vishwa Vidyapeetham", "amrita.edu", true),
            new CollegeData("Manipal Academy of Higher Education", "manipal.edu", true),
            new CollegeData("Birla Institute of Technology and Science", "bits-pilani.ac.in", true),
            new CollegeData("Thapar Institute of Engineering and Technology", "thapar.edu", true),
            new CollegeData("Lovely Professional University", "lpu.co.in", true),
            new CollegeData("Shiv Nadar University", "snu.edu.in", true),
            new CollegeData("Ashoka University", "ashoka.edu.in", true),
            new CollegeData("OP Jindal Global University", "jgu.edu.in", true),
            new CollegeData("Bennett University", "bennett.edu.in", true),
            new CollegeData("Graphic Era University", "geu.ac.in", true),
            new CollegeData("Dehradun Institute of Technology", "dituniversity.edu.in", true),
            new CollegeData("Chitkara University", "chitkara.edu.in", true),
            new CollegeData("Chandigarh University", "cuchd.in", true),
            new CollegeData("Panjab University", "puchd.ac.in", true),
            new CollegeData("Guru Nanak Dev University", "gndu.ac.in", true),
            new CollegeData("Punjabi University", "punjabiuniversity.ac.in", true),
            new CollegeData("Kurukshetra University", "kuk.ac.in", true),
            new CollegeData("Maharshi Dayanand University", "mdu.ac.in", true),
            new CollegeData("Chaudhary Charan Singh University", "ccsuniversity.ac.in", true),
            new CollegeData("Lucknow University", "lkouniv.ac.in", true),
            new CollegeData("Allahabad University", "allduniv.ac.in", true),
            new CollegeData("Kanpur University", "kanpuruniversity.org", true),
            new CollegeData("Gorakhpur University", "ddu.ac.in", true),
            new CollegeData("Rajasthan University", "uniraj.ac.in", true),
            new CollegeData("Jodhpur National University", "jnu.jodhpur.ac.in", true),
            new CollegeData("Maharaja Sayajirao University of Baroda", "msubaroda.ac.in", true),
            new CollegeData("Gujarat University", "gujaratuniversity.ac.in", true),
            new CollegeData("Sardar Patel University", "spuvvn.edu", true),
            new CollegeData("Dhirubhai Ambani Institute of Information and Communication Technology", "daiict.ac.in", true),
            new CollegeData("Nirma University", "nirmauni.ac.in", true),
            new CollegeData("Gujarat Technological University", "gtu.ac.in", true),
            new CollegeData("PDEU - Pandit Deendayal Energy University", "pdpu.ac.in", true),
            new CollegeData("University of Mumbai - Institute of Chemical Technology", "ictmumbai.edu.in", true),
            new CollegeData("Tata Institute of Social Sciences", "tiss.edu", true),
            new CollegeData("Indian Institute of Science", "iisc.ac.in", true),
            new CollegeData("Indian Statistical Institute", "isical.ac.in", true),
            new CollegeData("International Institute of Information Technology Bangalore", "iiitb.ac.in", true),
            new CollegeData("PES University", "pes.edu", true),
            new CollegeData("RV College of Engineering", "rvce.edu.in", true),
            new CollegeData("BMS College of Engineering", "bmsce.ac.in", true),
            new CollegeData("MS Ramaiah Institute of Technology", "msrit.edu", true),
            new CollegeData("Dayananda Sagar University", "dsu.edu.in", true),
            new CollegeData("Christ University", "christuniversity.in", true),
            new CollegeData("Bangalore University", "bangaloreuniversity.ac.in", true),
            new CollegeData("Visvesvaraya Technological University", "vtu.ac.in", true),
            new CollegeData("JSS Academy of Technical Education", "jssateb.ac.in", true),
            new CollegeData("Nitte University", "nitte.edu.in", true),
            new CollegeData("KLE Technological University", "kletech.ac.in", true),
            new CollegeData("Shoolini University", "shooliniuniversity.com", true),
            new CollegeData("Himachal Pradesh University", "hpuniv.ac.in", true),
            new CollegeData("Dr. Y.S. Parmar University of Horticulture and Forestry", "yspuniversity.ac.in", true),
            new CollegeData("Chaudhary Sarwan Kumar Himachal Pradesh Krishi Vishwavidyalaya", "hillagric.ac.in", true),
            new CollegeData("Sher-e-Kashmir University of Agricultural Sciences and Technology", "skuastkashmir.ac.in", true),
            new CollegeData("University of Kashmir", "kashmiruniversity.ac.in", true),
            new CollegeData("University of Jammu", "jammuuniversity.ac.in", true),
            new CollegeData("Shri Mata Vaishno Devi University", "smvdu.ac.in", true),
            new CollegeData("Islamic University of Science and Technology", "iust.ac.in", true),
            new CollegeData("Cluster University of Jammu", "clusterjammu.ac.in", true),
            new CollegeData("Cluster University of Srinagar", "cusrinagar.ac.in", true),
            new CollegeData("Uttarakhand Technical University", "uktech.ac.in", true),
            new CollegeData("Kumaun University", "kunainital.ac.in", true),
            new CollegeData("Doon University", "doonuniversity.ac.in", true),
            new CollegeData("University of Petroleum and Energy Studies", "upes.ac.in", true),
            new CollegeData("Dev Bhoomi Uttarakhand University", "dbuu.ac.in", true),
            new CollegeData("Patanjali University", "patanjaliuniversity.ac.in", true),
            new CollegeData("Quantum University", "quantumuniversity.edu.in", true),
            new CollegeData("Swami Rama Himalayan University", "srhu.edu.in", true),
            new CollegeData("University of Technology", "uotjaipur.com", true),
            new CollegeData("Arya Institute of Engineering and Technology", "aryainstitute.edu.in", true),
            new CollegeData("Poornima University", "poornima.edu.in", true),
            new CollegeData("Jaipur National University", "jnujaipur.ac.in", true),
            new CollegeData("Maharaja Ganga Singh University", "mgsubikaner.ac.in", true),
            new CollegeData("Maharaja Surajmal Brij University", "msbrijuniversity.ac.in", true),
            new CollegeData("Kota University", "uok.ac.in", true),
            new CollegeData("Jai Narain Vyas University", "jnvu.co.in", true),
            new CollegeData("Mohanlal Sukhadia University", "mlsu.ac.in", true),
            new CollegeData("Rajasthan Technical University", "rtu.ac.in", true),
            new CollegeData("Banasthali Vidyapith", "banasthali.org", true),
            new CollegeData("Malaviya National Institute of Technology Jaipur", "mnit.ac.in", true),
            new CollegeData("All India Institute of Medical Sciences Jodhpur", "aiimsjodhpur.edu.in", true),
            new CollegeData("Dr. A.P.J. Abdul Kalam Technical University", "aktu.ac.in", true),
            new CollegeData("Chhatrapati Shahu Ji Maharaj University", "csjmu.ac.in", true),
            new CollegeData("Deen Dayal Upadhyaya Gorakhpur University", "ddugu.ac.in", true),
            new CollegeData("Mahatma Jyotiba Phule Rohilkhand University", "mjpru.ac.in", true),
            new CollegeData("Veer Bahadur Singh Purvanchal University", "vbspu.ac.in", true),
            new CollegeData("Bundelkhand University", "bujhansi.ac.in", true),
            new CollegeData("Gautam Buddha University", "gbu.ac.in", true),
            new CollegeData("Shri Ramswaroop Memorial University", "srmu.ac.in", true),
            new CollegeData("Galgotias University", "galgotiasuniversity.edu.in", true),
            new CollegeData("Noida International University", "niu.edu.in", true),
            new CollegeData("GL Bajaj Institute of Technology and Management", "glbitm.org", true),
            new CollegeData("Greater Noida Institute of Technology", "gniot.net.in", true),
            new CollegeData("JSS Academy of Technical Education", "jssaten.ac.in", true),
            new CollegeData("Amity University", "amity.edu", true),
            new CollegeData("Jaypee Institute of Information Technology", "jiit.ac.in", true),
            new CollegeData("Netaji Subhas University of Technology", "nsut.ac.in", true),
            new CollegeData("Indira Gandhi Delhi Technical University for Women", "igdtuw.ac.in", true),
            new CollegeData("Guru Gobind Singh Indraprastha University", "ipu.ac.in", true),
            new CollegeData("Delhi Technological University", "dtu.ac.in", true),
            new CollegeData("Jamia Hamdard", "jamiahamdard.edu", true),
            new CollegeData("The NorthCap University", "ncuindia.edu", true)
        );
    }
    
    private static class CollegeData {
        private final String name;
        private final String domain;
        private final boolean verified;
        
        public CollegeData(String name, String domain, boolean verified) {
            this.name = name;
            this.domain = domain;
            this.verified = verified;
        }
        
        public String getName() { return name; }
        public String getDomain() { return domain; }
        public boolean isVerified() { return verified; }
    }
}
