import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/Feather'

import { useAuth } from "../../hooks/Auth";
import api from "../../services/api";

import { Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar, ProvidersList,
ProviderContainer, ProviderAvatar, ProviderInfo, ProviderName, ProviderMeta, ProviderMetaText,
ProvidersListTitle } from "./styles";

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}


const DashBoard: React.FC = () => {
    const [providers, setProviders] = useState<Provider[] | any>([]);

    const { signOut, user } = useAuth();
    const { navigate } = useNavigation<any>();

    useEffect(() => {
        api.get('providers').then(response => {
            setProviders(response.data);
        });
    }, []);

    const navigateToProfile= useCallback(() => {
        navigate('/Profile');
        signOut();
    }, [signOut]);

    const navigateToCreateAppointment = useCallback((providerId: string) => {
        navigate('CreateAppointmet', {providerId})
    }, [navigate])
    
    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem vindo, {"\n"}
                    <UserName>
                        {user.name}
                    </UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }}/>
                </ProfileButton>
            </Header>

            <ProvidersList 
                data={providers}
                keyExtractor={provider => provider.id}
                ListHeaderComponent={
                    <ProvidersListTitle>Cabeto Carreiros</ProvidersListTitle>
                }
                renderItem={({ item: provider }) => (
                    <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
                        <ProviderAvatar source={{ uri: provider.avatar_url }} />
                        
                        <ProviderInfo>
                            <ProviderName>{provider.name}</ProviderName>

                            <ProviderMeta>
                                <Icon name="calendar" size={14} color="#ff9000" />
                                <ProviderMetaText>Segunda á sexta</ProviderMetaText>
                            </ProviderMeta>
                            <ProviderMeta>
                                <Icon name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h ás 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    )
};

export default DashBoard;