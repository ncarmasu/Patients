package ro.nca.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ro.nca.data.model.Patient;
import ro.nca.data.repositories.PatientsRepo;

/**
 * Created by Narcis on 8/30/2017.
 */
@RestController
@RequestMapping("/api/pacients")
public class PatientsController {

    @Autowired
    private PatientsRepo patientsRepo;

    @RequestMapping(method = RequestMethod.GET)
    public Iterable<Patient> getAllPatients() {
        return null;
    }
}
