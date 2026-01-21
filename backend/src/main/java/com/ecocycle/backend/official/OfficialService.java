package com.ecocycle.backend.official;

import com.ecocycle.backend.official.dto.request.CreateOfficialRequest;
import com.ecocycle.backend.official.dto.request.UpdateOfficialRequest;
import com.ecocycle.backend.official.model.Official;
import java.util.List;
import java.util.UUID;

public interface OfficialService {
    List<Official> getOfficials();
    Official getOfficialById(UUID id);
    Official createOfficial(CreateOfficialRequest request);
    Official updateOfficial(UUID id, UpdateOfficialRequest request);
    Official deleteOfficial(UUID id);
}