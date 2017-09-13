package ro.nca.data.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(callSuper = false, exclude = {"patient"})

@Entity
@Table(name = "visits")
public class Visit extends BaseEntity {


    private String observations;

    private VisitType type;

    @JsonIgnore
    @ManyToOne
    private Doctor doctor;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public Visit(VisitType type, String observations, LocalDateTime visitTime) {
        super();
        this.type = type;
        this.observations = observations;
        setCreateTime(visitTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm")
    public Date getDate() {
        return new Date(getCreateTime().toEpochMilli());
    }
}