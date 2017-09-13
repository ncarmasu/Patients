package ro.nca.data.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

/**
 * Created by Narcis on 8/30/2017.
 */
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true, exclude = {"visits"})
@Entity
@Table(name = "patients")
public class Patient extends Person {

    @JsonIgnore
    @OneToMany(mappedBy = "patient", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Visit> visits;

    @JsonIgnore
    @ManyToOne
    private Doctor doctor;

    private String description;

    public Patient(String firstName, String lastName, Doctor doctor) {
        super(firstName, lastName);
        this.doctor = doctor;
    }
}
